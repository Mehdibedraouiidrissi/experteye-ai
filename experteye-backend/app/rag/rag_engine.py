# rag_engine.py - Core RAG system for search and Q&A with persistent vector store
import streamlit as st
import re
import time
import logging
import hashlib
from typing import List, Dict, Any, Optional, Tuple
from langchain_core.documents import Document
from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

# Configure logger
logger = logging.getLogger("DocumentIntelligence.RAG")

# Enhanced template for QA
ENHANCED_QA_PROMPT = """
# ROLE AND PURPOSE
You are an expert document intelligence system analyzing information for Experteye. Your purpose is to provide accurate, detailed, and well-structured information from company documents. Your responses must be factual, comprehensive, and structured—based strictly on the provided document context without fabrication or assumption.

# CONTEXT ANALYSIS FRAMEWORK
Before responding, analyze the document context systematically:
1. RELEVANCE: Determine how directly each context fragment addresses the question
2. COMPLETENESS: Identify information gaps across document fragments
3. CONSISTENCY: Note agreement or contradictions between sources
4. RECENCY: Prioritize recent information when timestamps conflict
5. SPECIFICITY: Evaluate the precision and granularity of details

# CORE INSTRUCTIONS
1. DOCUMENT FIDELITY: Base your answer EXCLUSIVELY on the provided context snippets and chat history. NEVER invent or hallucinate information.

2. COMPREHENSIVE SYNTHESIS: Information relevant to the query may be distributed across multiple fragments or documents. COMBINE all relevant pieces to provide a complete answer.

3. SOURCE AWARENESS: Pay special attention to filenames and document metadata which provide context about content origin, purpose, and reliability.

4. PROFESSIONAL FORMATTING:
   - Use clear section headers when appropriate
   - Implement bullet points for lists and complex information
   - Ensure proper paragraph breaks for readability
   - Structure people information as organized professional profiles

5. INFORMATION COMPLETENESS:
   - If information is partial or unclear, acknowledge this explicitly
   - Structure responses like professional business documents with logical organization
   - If information cannot be found at all, respond ONLY with: "I couldn't find information about this in the available documents."

6. THOROUGH ANALYSIS:
   - Read ALL provided context carefully
   - Cross-reference information across different document chunks
   - Identify the most relevant and consistent information

7. STRUCTURAL REQUIREMENTS:
   - Begin with a clear, concise direct answer
   - Follow with detailed explanation citing specific document sources
   - Use bullet points for complex information
   - Clearly indicate if information is partial or requires more context

8. ATTRIBUTION AND TRANSPARENCY:
   - ALWAYS indicate which document(s) information comes from
   - If information seems contradictory, explain the discrepancy
   - If no clear answer exists, state: "Insufficient or conflicting information"

9. REASONING METHODOLOGY:
   - Demonstrate step-by-step reasoning
   - Show how you connected different pieces of context
   - Explain your information extraction process

10. CONTEXTUAL INTEGRATION:
    - Treat each context chunk as a potential piece of a larger puzzle
    - Look for corroborating evidence across chunks
    - Be aware of potential biases or incomplete information

11. INFORMATION BOUNDARIES:
    - Use only the given document snippets and chat history
    - Never generate information beyond the provided sources

12. CONFLICT RESOLUTION:
    - If data is incomplete, explicitly state: "The available information is incomplete, but here is what can be inferred."
    - If documents conflict, highlight discrepancies with sources
    - If no information is found, respond with: "No relevant information is available in the provided documents."

13. REFERENCE CLARITY:
    - Clearly cite the filenames or sections where information was found
    - If multiple sources contribute, synthesize without redundancy

14. TEMPORAL AWARENESS:
    - Always mention when information was created or last updated
    - Include document dates when available
    - Begin responses with temporal context: "Based on documents from [timeframe]..."
    - Prioritize the most recent information when dates conflict
    - Explicitly state when date information is unavailable

# RESPONSE STRUCTURE
1. DIRECT ANSWER (1-2 sentences summarizing key findings)

2. DETAILED EXPLANATION
   - Key Findings:
     * Primary insights organized by relevance
     * Critical details with clear attribution
     * Temporal context when available
   
   - Source Documents:
     * List of filenames, sections, or chunks used
     * Date information for each source when available
   
   - Additional Context:
     * Supporting details that enhance understanding
     * Related information from other document sections

3. LOGICAL REASONING
   - Explanation of information connections
   - Thought process behind synthesized conclusions
   - Disclosure of limitations or assumptions

4. CONFIDENCE ASSESSMENT
   - High: Multiple consistent sources with direct relevance
   - Medium: Limited or partially consistent information
   - Low: Tangential information or significant gaps

# THINKING PROCESS
<think>
1. Analyze the question to identify key information requirements
2. Systematically review each context fragment for relevance
3. Extract and organize key information by source and topic
4. Identify information gaps or inconsistencies
5. Formulate a comprehensive, accurate response strategy
</think>

# CURRENT CONTEXT:
{context}

# QUESTION: 
{question}

PROFESSIONAL ANSWER:
"""

# Add this at the top of your file, outside of any class
def rerank_documents(query: str, docs: List[Document], num_to_return: int = 5) -> List[Document]:
    """Standalone reranking function independent of any class"""
    if not docs:
        return []
    
    scored_results = []
    query_lower = query.lower()
    query_terms = [term.lower() for term in query.split() if len(term) > 2]
    
    for doc in docs:
        # Start with base score
        score = 0.0
        content_lower = doc.page_content.lower()
        
        # 1. Exact phrase matching (highest weight)
        if query_lower in content_lower:
            score += 0.4
            
        # 2. Term frequency scoring
        term_matches = sum(content_lower.count(term) for term in query_terms)
        term_density = term_matches / (len(content_lower) + 1)
        score += min(0.3, term_density * 100)
        
        # 3. Metadata relevance
        source = doc.metadata.get('source', '') if hasattr(doc, 'metadata') else ''
        if any(term in source.lower() for term in query_terms):
            score += 0.15
            
        # 4. Structural relevance - headers, titles, etc.
        first_200_chars = content_lower[:200]
        if any(header in first_200_chars for header in ['# ', '## ', 'title:', 'heading:']):
            for term in query_terms:
                if term in first_200_chars:
                    score += 0.15
                    break
        
        # 5. Position boost - terms appearing early in document
        for term in query_terms:
            position = content_lower.find(term)
            if position != -1:
                position_score = max(0, 0.1 * (1 - (position / min(len(content_lower), 1000))))
                score += position_score
        
        scored_results.append((doc, score))
    
    # Sort by score (highest first) and return top results
    sorted_results = sorted(scored_results, key=lambda x: x[1], reverse=True)
    
    # Return top N results
    return [doc for doc, _ in sorted_results[:num_to_return]]

class RAGEngine:
    """Core RAG engine that handles search and question answering with persistent vector store"""
    
    def __init__(
        self,
        document_processor,
        llm_model: str,
        temperature: float = 0.1,
        debug: bool = False
    ):
        self.document_processor = document_processor
        self.debug = debug
        
        # Initialize LLM
        try:
            self.llm = OllamaLLM(
                model=llm_model,
                temperature=temperature,
                max_tokens=2048
            )
            logger.info(f"Initialized LLM model: {llm_model}")
            
            # Only show in sidebar if explicitly debugging
            if debug and st.session_state.get('show_debug_info', False):
                st.sidebar.success(f"✅ Connected to LLM model: {llm_model}")
        except Exception as e:
            error_msg = f"Error initializing LLM: {str(e)}"
            logger.error(error_msg)
            if debug and st.session_state.get('show_debug_info', False):
                st.error(error_msg)
            self.llm = None
    
    def _get_document_id(self, doc: Document) -> str:
        """Generate a unique ID for a document to help with deduplication"""
        if not hasattr(doc, 'metadata'):
            return hashlib.md5(doc.page_content.encode()).hexdigest()
        
        # Create a composite key from metadata and first 100 chars of content
        source = doc.metadata.get('source', '')
        page = str(doc.metadata.get('page', ''))
        content_hash = hashlib.md5(doc.page_content[:100].encode()).hexdigest()[:10]
        
        return f"{source}_{page}_{content_hash}"

    def extract_document_dates(self, doc):
        """Extract document dates from metadata and content"""
        dates = {}
        
        # Get last_modified from metadata (already captured during document processing)
        if hasattr(doc, 'metadata') and 'last_modified' in doc.metadata:
            # Convert timestamp to readable date
            from datetime import datetime
            last_modified = datetime.fromtimestamp(doc.metadata['last_modified'])
            dates['file_modified'] = last_modified.strftime('%Y-%m-%d')
        
        # Look for dates in document content
        if hasattr(doc, 'page_content'):
            content = doc.page_content
            
            # Common date patterns
            import re
            # ISO date (YYYY-MM-DD)
            iso_dates = re.findall(r'\b(\d{4}-\d{2}-\d{2})\b', content)
            # US dates (MM/DD/YYYY)
            us_dates = re.findall(r'\b(\d{1,2}/\d{1,2}/\d{4})\b', content)
            # European dates (DD/MM/YYYY)
            eu_dates = re.findall(r'\b(\d{1,2}/\d{1,2}/\d{4})\b', content)
            # Textual dates (Month DD, YYYY)
            text_dates = re.findall(r'\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b', content)
            # Year references
            years = re.findall(r'\b(20\d{2}|19\d{2})\b', content)
            
            # Add found dates to the dates dictionary
            if iso_dates:
                dates['content_dates'] = iso_dates
            if us_dates:
                dates['us_dates'] = us_dates
            if eu_dates:
                dates['eu_dates'] = eu_dates
            if text_dates:
                dates['text_dates'] = text_dates
            if years and not any([iso_dates, us_dates, eu_dates, text_dates]):
                dates['years'] = years
        
        return dates

    def full_content_search(self, query: str) -> List[str]:
        """Search through the full content of all documents"""
        # Delegate to vector store's full content search if possible
        if hasattr(self.document_processor.vector_store, 'full_content_search'):
            return self.document_processor.vector_store.full_content_search(query)
        
        # Fallback to document processor's document content
        matching_docs = []
        
        # Normalize query
        query_terms = [term.lower() for term in query.split() if len(term) > 2]
        
        # Check each document's full content
        for filename, content in self.document_processor.get_document_content().items():
            content_lower = content.lower()
            
            # Check if any query term appears in the content
            for term in query_terms:
                if term in content_lower:
                    matching_docs.append(filename)
                    break
        
        return matching_docs
    
    def keyword_search(self, query: str, case_sensitive: bool = False) -> List[Document]:
        """Perform keyword search on documents with advanced matching"""
        # Get all available documents
        all_documents = self.document_processor.get_all_documents()
        if not all_documents:
            return []
            
        matched_docs = []
        
        # Prepare query terms - remove very common words
        stop_words = {"the", "a", "an", "is", "are", "was", "were", "in", "on", "at", "to", "for", "with", "by"}
        search_terms = [term for term in query.lower().split() if term.lower() not in stop_words and len(term) > 2]
        
        # Search for each term
        for doc in all_documents:
            content = doc.page_content if case_sensitive else doc.page_content.lower()
            
            # Check if any search term is in the content (whole word matching)
            found = False
            for term in search_terms:
                term_to_check = term if case_sensitive else term.lower()
                # Use regex to match whole words
                pattern = r'\b' + re.escape(term_to_check) + r'\b'
                if re.search(pattern, content):
                    found = True
                    break
            
            if found:
                matched_docs.append(doc)
        
        return matched_docs
    
    def fuzzy_name_search(self, query: str) -> List[Document]:
        """Perform fuzzy name search - useful for finding people with name variations"""
        # Get all available documents
        all_documents = self.document_processor.get_all_documents()
        if not all_documents:
            return []
            
        matched_docs = []
        
        # Prepare name components
        name_parts = [part.lower() for part in query.split() if len(part) > 1]
        if not name_parts:
            return []
        
        # Check each document for name variations
        for doc in all_documents:
            content_lower = doc.page_content.lower()
            source = doc.metadata.get('source', '').lower() if hasattr(doc, 'metadata') else ''
            
            # Check content and source filename for name parts
            found_parts = 0
            for part in name_parts:
                # Check in content
                if part in content_lower:
                    found_parts += 1
                # Check in filename
                elif part in source:
                    found_parts += 1
            
            # If we found most of the name parts, consider it a match
            if found_parts >= max(1, len(name_parts) // 2):
                matched_docs.append(doc)
        
        return matched_docs
    
    def rerank_results(self, query: str, initial_results: List[Document], k: int = 5) -> List[Document]:
        """Re-rank search results using more sophisticated relevance scoring"""
        if not initial_results:
            return []
        
        if self.debug:
            logger.info(f"Re-ranking {len(initial_results)} initial results")
        
        scored_results = []
        query_lower = query.lower()
        query_terms = [term.lower() for term in query.split() if len(term) > 2]
        
        for doc in initial_results:
            # Start with base score
            score = 0.0
            content_lower = doc.page_content.lower()
            
            # 1. Exact phrase matching (highest weight)
            if query_lower in content_lower:
                score += 0.4
                
            # 2. Term frequency scoring
            term_matches = sum(content_lower.count(term) for term in query_terms)
            term_density = term_matches / (len(content_lower) + 1)  # Avoid division by zero
            score += min(0.3, term_density * 100)  # Cap at 0.3
            
            # 3. Metadata relevance
            source = doc.metadata.get('source', '') if hasattr(doc, 'metadata') else ''
            if any(term in source.lower() for term in query_terms):
                score += 0.15
                
            # 4. Structural relevance - headers, titles, etc.
            first_200_chars = content_lower[:200]
            if any(header in first_200_chars for header in ['# ', '## ', 'title:', 'heading:']):
                for term in query_terms:
                    if term in first_200_chars:
                        score += 0.15
                        break
            
            # 5. Position boost - terms appearing early in document
            for term in query_terms:
                position = content_lower.find(term)
                if position != -1:
                    # Higher score for terms appearing earlier
                    position_score = max(0, 0.1 * (1 - (position / min(len(content_lower), 1000))))
                    score += position_score
            
            # Add to results with score
            scored_results.append((doc, score))
        
        # Sort by score (highest first) and return top k
        sorted_results = sorted(scored_results, key=lambda x: x[1], reverse=True)
        
        if self.debug:
            # Log top scores for debugging
            score_log = "\n".join([
                f"Score: {score:.2f} - Source: {doc.metadata.get('source', 'Unknown')}" 
                for doc, score in sorted_results[:3]
            ])
            logger.info(f"Top reranked scores:\n{score_log}")
        
        return [doc for doc, _ in sorted_results[:k]]

    def composite_search(self, query: str, k: int = 10) -> List[Document]:
        """Perform comprehensive composite search with document deduplication and intelligent ranking"""
        try:
            # Get vector store from document processor
            vector_store = self.document_processor.get_vector_store().vector_store
            
            if not vector_store:
                logger.warning("No vector store available for search")
                return []
                
            results_with_scores = {}  # Document -> score
            
            # Get more results initially to allow for reranking
            initial_k = min(k * 3, 30)  # Get 3x requested results but cap at 30
            
            # 1. Vector search (semantic matching)
            try:
                vector_results = vector_store.similarity_search_with_score(query, k=initial_k)
                
                # Add vector results with their scores
                for doc, score in vector_results:
                    # Convert distance to similarity score (higher is better)
                    similarity = 1.0 / (1.0 + score)
                    doc_id = self._get_document_id(doc)
                    results_with_scores[doc_id] = {
                        'doc': doc,
                        'score': similarity * 2.0,  # Weight semantic search higher
                        'match_type': 'semantic'
                    }
                
                if self.debug:
                    logger.info(f"Vector search found {len(vector_results)} results")
            except Exception as e:
                error_msg = f"Error in vector search: {str(e)}"
                logger.error(error_msg)
                if self.debug:
                    st.error(error_msg)
            
            # 2. Keyword search (exact matching)
            keyword_results = self.keyword_search(query)
            for doc in keyword_results:
                doc_id = self._get_document_id(doc)
                if doc_id in results_with_scores:
                    # If already found in vector search, boost score
                    results_with_scores[doc_id]['score'] += 1.0
                    results_with_scores[doc_id]['match_type'] += '+keyword'
                else:
                    # Add new result
                    results_with_scores[doc_id] = {
                        'doc': doc,
                        'score': 1.0,  # Base score for keyword match
                        'match_type': 'keyword'
                    }
            
            if self.debug:
                logger.info(f"Keyword search found {len(keyword_results)} results")
            
            # 3. Fuzzy name search (for people names)
            name_results = self.fuzzy_name_search(query)
            for doc in name_results:
                doc_id = self._get_document_id(doc)
                if doc_id in results_with_scores:
                    # If already found by other methods, boost score substantially
                    results_with_scores[doc_id]['score'] += 1.5
                    results_with_scores[doc_id]['match_type'] += '+name'
                else:
                    # Add new result with good score
                    results_with_scores[doc_id] = {
                        'doc': doc,
                        'score': 1.5,  # Higher score for name match
                        'match_type': 'name'
                    }
            
            if self.debug:
                logger.info(f"Name search found {len(name_results)} results")
            
            # 4. Filename search - check if query terms appear in filenames
            for doc in self.document_processor.get_all_documents():
                if not hasattr(doc, 'metadata') or 'source' not in doc.metadata:
                    continue
                
                filename = doc.metadata['source'].lower()
                query_terms = [term.lower() for term in query.split() if len(term) > 2]
                
                for term in query_terms:
                    if term in filename:
                        doc_id = self._get_document_id(doc)
                        if doc_id in results_with_scores:
                            # If already found, boost score significantly
                            results_with_scores[doc_id]['score'] += 2.0
                            results_with_scores[doc_id]['match_type'] += '+filename'
                        else:
                            # Add new result with high score
                            results_with_scores[doc_id] = {
                                'doc': doc,
                                'score': 2.0,  # High score for filename match
                                'match_type': 'filename'
                            }
                        break
            
            # 5. Full content search to ensure coverage
            matching_docs = self.full_content_search(query)
            if matching_docs:
                if self.debug:
                    logger.info(f"Full content search found matches in {len(matching_docs)} documents")
                
                # For each matching document, add a representative sample from available documents
                all_documents = self.document_processor.get_all_documents()
                for doc_name in matching_docs:
                    doc_chunks = [doc for doc in all_documents 
                                if hasattr(doc, 'metadata') and 
                                doc.metadata.get('source') == doc_name]
                    
                    # Take first chunk if available
                    if doc_chunks:
                        doc = doc_chunks[0]
                        doc_id = self._get_document_id(doc)
                        if doc_id not in results_with_scores:
                            results_with_scores[doc_id] = {
                                'doc': doc,
                                'score': 0.5,  # Lower score for content-only match
                                'match_type': 'content'
                            }
            
            # Sort results by score (descending)
            sorted_results = sorted(
                results_with_scores.values(),
                key=lambda x: x['score'],
                reverse=True
            )
            
            # Take top results for reranking
            top_initial_results = [item['doc'] for item in sorted_results[:initial_k]]
            
            # Apply reranking to get final results
            final_results = []
            if top_initial_results:
                final_results = self.rerank_results(query, top_initial_results, k)
            
            # If no results after reranking, fall back to original top k
            if not final_results:
                final_results = [item['doc'] for item in sorted_results[:k]]
            
            if self.debug:
                logger.info(f"Final composite search returned {len(final_results)} results")
                if len(sorted_results) > 0:
                    scores_display = "\n".join([
                        f"{item['match_type']}: {item['score']:.2f} - {item['doc'].metadata.get('source', 'Unknown')}"
                        for item in sorted_results[:5]  # Show top 5 for debugging
                    ])
                    logger.info(f"Top result scores before reranking:\n{scores_display}")
            
            return final_results
            
        except Exception as e:
            error_msg = f"Error in composite search: {str(e)}"
            logger.error(error_msg)
            if self.debug:
                st.error(error_msg)
            return []

    def analyze_retrieval_quality(self, query: str, retrieved_docs: List[Document]) -> Dict[str, Any]:
        """Analyze the quality of retrieved documents for a query"""
        metrics = {
            "total_docs": len(retrieved_docs),
            "avg_doc_length": 0,
            "term_coverage": 0,
            "source_diversity": 0,
            "content_variability": 0,
            "query_term_frequency": {}
        }
        
        if not retrieved_docs:
            return metrics
        
        # Calculate average document length
        total_length = sum(len(doc.page_content) for doc in retrieved_docs)
        metrics["avg_doc_length"] = total_length / len(retrieved_docs)
        
        # Calculate query term coverage and frequency
        query_terms = [term.lower() for term in query.split() if len(term) > 2]
        if query_terms:
            term_matches = []
            term_frequencies = {}
            
            for term in query_terms:
                # Count docs containing term
                matches = sum(1 for doc in retrieved_docs if term in doc.page_content.lower())
                term_matches.append(matches / len(retrieved_docs))
                
                # Count total term occurrences
                occurrences = sum(doc.page_content.lower().count(term) for doc in retrieved_docs)
                term_frequencies[term] = occurrences
            
            metrics["term_coverage"] = sum(term_matches) / len(query_terms)
            metrics["query_term_frequency"] = term_frequencies
        
        # Calculate source diversity
        sources = set()
        for doc in retrieved_docs:
            if hasattr(doc, 'metadata') and 'source' in doc.metadata:
                sources.add(doc.metadata['source'])
        metrics["source_diversity"] = len(sources) / len(retrieved_docs) if retrieved_docs else 0
        
        # Calculate content variability (similarity between documents)
        if len(retrieved_docs) > 1:
            # Simple content similarity measure
            content_sims = []
            for i in range(len(retrieved_docs)):
                for j in range(i+1, len(retrieved_docs)):
                    # Jaccard similarity of document content
                    doc1_tokens = set(retrieved_docs[i].page_content.lower().split())
                    doc2_tokens = set(retrieved_docs[j].page_content.lower().split())
                    
                    intersection = len(doc1_tokens.intersection(doc2_tokens))
                    union = len(doc1_tokens.union(doc2_tokens))
                    
                    if union > 0:
                        similarity = intersection / union
                        content_sims.append(similarity)
            
            # Average similarity (higher number = more similar documents)
            if content_sims:
                avg_similarity = sum(content_sims) / len(content_sims)
                # Convert to variability (higher number = more diverse content)
                metrics["content_variability"] = 1 - avg_similarity
        
        # Log metrics for debugging
        if self.debug:
            logger.info(f"Retrieval quality metrics: {metrics}")
        
        return metrics

    def ranking_function(self, query: str, documents: List[Document], num_results: int) -> List[Document]:
        """Alternative reranking function to avoid parameter issues"""
        if not documents:
            return []
        
        if self.debug:
            logger.info(f"Re-ranking {len(documents)} documents")
        
        scored_results = []
        query_lower = query.lower()
        query_terms = [term.lower() for term in query.split() if len(term) > 2]
        
        for doc in documents:
            # Start with base score
            score = 0.0
            content_lower = doc.page_content.lower()
            
            # 1. Exact phrase matching (highest weight)
            if query_lower in content_lower:
                score += 0.4
                
            # 2. Term frequency scoring
            term_matches = sum(content_lower.count(term) for term in query_terms)
            term_density = term_matches / (len(content_lower) + 1)  # Avoid division by zero
            score += min(0.3, term_density * 100)  # Cap at 0.3
            
            # 3. Metadata relevance
            source = doc.metadata.get('source', '') if hasattr(doc, 'metadata') else ''
            if any(term in source.lower() for term in query_terms):
                score += 0.15
                
            # 4. Structural relevance - headers, titles, etc.
            first_200_chars = content_lower[:200]
            if any(header in first_200_chars for header in ['# ', '## ', 'title:', 'heading:']):
                for term in query_terms:
                    if term in first_200_chars:
                        score += 0.15
                        break
            
            # 5. Position boost - terms appearing early in document
            for term in query_terms:
                position = content_lower.find(term)
                if position != -1:
                    # Higher score for terms appearing earlier
                    position_score = max(0, 0.1 * (1 - (position / min(len(content_lower), 1000))))
                    score += position_score
            
            # Add to results with score
            scored_results.append((doc, score))
        
        # Sort by score (highest first) and return top results
        sorted_results = sorted(scored_results, key=lambda x: x[1], reverse=True)
        
        if self.debug:
            # Log top scores for debugging
            score_log = "\n".join([
                f"Score: {score:.2f} - Source: {doc.metadata.get('source', 'Unknown')}" 
                for doc, score in sorted_results[:3]
            ])
            logger.info(f"Top reranked scores:\n{score_log}")
        
        # Return top N results
        return [doc for doc, _ in sorted_results[:num_results]]

    def process_query(self, original_query: str) -> List[str]:
        """Generate multiple query variations to improve retrieval coverage"""
        queries = [original_query]  # Always include original
        
        query_lower = original_query.lower()
        
        # Add simple rephrasing
        if "how to" in query_lower:
            queries.append(query_lower.replace("how to", "steps for"))
        
        if "what is" in query_lower:
            queries.append(query_lower.replace("what is", "definition of"))
            queries.append(query_lower.replace("what is", "explain"))
        
        # Extract key entities for targeted search
        import re
        potential_entities = re.findall(r'\b[A-Z][a-zA-Z]*\b', original_query)
        if potential_entities:
            entity_query = " ".join(potential_entities)
            queries.append(entity_query)
        
        # Generate keyword-only query
        stop_words = {"the", "a", "an", "is", "are", "was", "were", "in", "on", "at", "to", "for", "with", "by"}
        keywords = [term for term in query_lower.split() if term not in stop_words and len(term) > 2]
        if keywords:
            queries.append(" ".join(keywords))
        
        # Log generated queries if debugging
        if self.debug:
            logger.info(f"Original query: {original_query}")
            logger.info(f"Generated query variations: {queries[1:]}")
        
        return queries

    def execute_multi_query_search(self, query: str, k: int = 10) -> List[Document]:
        """Execute search with multiple query variations for better recall - optimized version"""
        try:
            logger.info(f"Starting execute_multi_query_search with query: {query}, k={k}")
            
            # OPTIMIZATION: Limit query variations to at most 2 variations
            original_query = query
            keywords = [term for term in query.lower().split() if len(term) > 2]
            keyword_query = " ".join(keywords) if keywords else query
            
            query_variations = [original_query]
            # Only add keyword query if it's different from original
            if keyword_query != original_query:
                query_variations.append(keyword_query)
                
            logger.info(f"Using {len(query_variations)} query variations")
            
            # Track unique documents by ID
            all_docs_map = {}
            
            # Search with each query variation
            for i, q in enumerate(query_variations):
                try:
                    logger.info(f"Searching with variation {i+1}/{len(query_variations)}: {q}")
                    docs = self.composite_search(q, k=k)
                    logger.info(f"Found {len(docs)} documents for variation {i+1}")
                    
                    # Add to results map
                    for doc in docs:
                        doc_id = self._get_document_id(doc)
                        if doc_id not in all_docs_map:
                            all_docs_map[doc_id] = doc
                except Exception as e:
                    logger.error(f"Error searching with variation {i+1}: {str(e)}")
                    continue
            
            # Get all unique docs
            unique_docs = list(all_docs_map.values())
            logger.info(f"Collected {len(unique_docs)} unique documents")
            
            # Rerank the results
            final_results = rerank_documents(query, unique_docs, num_to_return=k)
            return final_results
                
        except Exception as e:
            logger.error(f"Error in execute_multi_query_search: {str(e)}")
            # Fallback to simple search
            return self.composite_search(query, k=k)

    def answer_question(self, question: str, context_docs: List[Document], use_model_knowledge: bool = False, used_web_search: bool = False, web_content: str = "") -> str:
        """
        Generate an answer using the LLM based on retrieved documents with enhanced source control
        
        Args:
            question: The user's question
            context_docs: List of relevant document chunks
            use_model_knowledge: Whether to allow the model to use its built-in knowledge
            used_web_search: Whether web search was performed
            web_content: Web search results content (if available)
            
        Returns:
            Generated answer text
        """
        try:
            # Start with identifying information sources
            sources_used = []
            if context_docs:
                sources_used.append("document content")
            if used_web_search:
                sources_used.append("web search")
            if use_model_knowledge:
                sources_used.append("model knowledge")
            
            # Log information sources being used
            source_msg = f"Generating answer using: {', '.join(sources_used) if sources_used else 'no specific sources'}"
            logger.info(source_msg)
            
            # Define the base prompt template
            prompt_template = ENHANCED_QA_PROMPT
            
            # ==========================================
            # Step 1: Prepare knowledge source instructions
            # ==========================================
            
            # Define instructions for different knowledge source configurations
            knowledge_restriction_instructions = """
    # STRICT KNOWLEDGE SOURCE LIMITATIONS
    You MUST adhere to the following restrictions when answering:

    """
            
            # No model knowledge allowed
            if not use_model_knowledge:
                knowledge_restriction_instructions += """
    - DO NOT use your built-in knowledge or training data to answer the question
    - ONLY use information explicitly found in the provided context
    - If the necessary information is not in the context, clearly state this limitation
    - Do not speculate, guess, or provide answers based on general knowledge
    - If asked about recent events, people, facts, or data not in the context, state that this information isn't available
    """
            else:
                knowledge_restriction_instructions += """
    - You MAY use your built-in knowledge to supplement information from other sources
    - When using your knowledge, clearly indicate this with phrases like "Based on my knowledge..."
    - Prioritize factual information over general knowledge when possible
    """
            
            # Document usage instructions
            if context_docs:
                knowledge_restriction_instructions += """
    - Carefully analyze the provided document content
    - Extract relevant information from the documents and cite specific sources
    - Combine information across multiple document chunks when appropriate
    - When documents contain conflicting information, note the discrepancy
    """
            else:
                knowledge_restriction_instructions += """
    - No document content is provided for this question
    """
            
            # Web search usage instructions
            if used_web_search:
                knowledge_restriction_instructions += """
    - Utilize the provided web search results for current, factual information
    - Web search results should be treated as more authoritative for recent events or data
    - Cite web sources when using information from search results
    """
            
            # Source attribution requirements
            knowledge_restriction_instructions += """
    # SOURCE ATTRIBUTION REQUIREMENTS
    - ALWAYS be transparent about the source of your information
    - For document information: "According to [document name]..."
    - For web search: "According to [website/article]..."
    - For model knowledge: "Based on general knowledge..."
    - When synthesizing from multiple sources, explain how the information connects
    """
            
            # ==========================================
            # Step 2: Create appropriate response format instructions
            # ==========================================
            
            response_format_instructions = """
    # RESPONSE FORMAT
    Your answer should follow this structure:

    1. Direct answer (1-2 sentences summarizing the key finding)
    2. Detailed explanation with source attribution
    3. Relevant supporting information and context
    """
            
            # Add specific instructions based on question analysis
            question_lower = question.lower()
            
            # Detect question type and add specialized format instructions
            if any(x in question_lower for x in ["how to", "steps", "procedure", "guide"]):
                response_format_instructions += """
    For this how-to/procedural question:
    - Provide a clear, step-by-step response
    - Number each step
    - Include any cautions or prerequisites
    - Focus on actionable guidance
    """
            elif any(x in question_lower for x in ["compare", "difference", "versus", "vs"]):
                response_format_instructions += """
    For this comparison question:
    - Present information in a structured comparison format
    - Highlight key similarities and differences
    - Be balanced in your treatment of compared items
    - Use parallel structure when comparing attributes
    """
            elif any(x in question_lower for x in ["why", "reason", "cause"]):
                response_format_instructions += """
    For this explanatory question:
    - Present a logical explanation of causes and effects
    - Consider multiple factors if relevant
    - Explain the reasoning or mechanisms involved
    - Provide context that helps understand the causality
    """
            elif any(x in question_lower for x in ["when", "where", "who", "what year", "which country"]):
                response_format_instructions += """
    For this factual question:
    - Provide precise factual information
    - Be direct and specific
    - Cite the exact source of this factual information
    - Note any conflicting information from different sources
    """
            
            # ==========================================
            # Step 3: Modify knowledge source priorities based on configuration
            # ==========================================
            
            source_priorities = ""
            
            # Set source priorities based on the enabled knowledge sources
            if used_web_search and context_docs and use_model_knowledge:
                source_priorities = """
    # KNOWLEDGE SOURCE PRIORITIES
    For this query, prioritize sources in this order:
    1. Web search results (for current factual information)
    2. Document content (for specific organizational information)
    3. Model knowledge (to fill gaps or provide general context)
    """
            elif used_web_search and context_docs and not use_model_knowledge:
                source_priorities = """
    # KNOWLEDGE SOURCE PRIORITIES
    For this query, prioritize sources in this order:
    1. Web search results (for current factual information)
    2. Document content (for specific organizational information)
    DO NOT use model knowledge even if the above sources seem insufficient.
    """
            elif used_web_search and not context_docs and use_model_knowledge:
                source_priorities = """
    # KNOWLEDGE SOURCE PRIORITIES
    For this query, prioritize sources in this order:
    1. Web search results (for current factual information)
    2. Model knowledge (for general context and understanding)
    There are no document sources available for this query.
    """
            elif not used_web_search and context_docs and use_model_knowledge:
                source_priorities = """
    # KNOWLEDGE SOURCE PRIORITIES
    For this query, prioritize sources in this order:
    1. Document content (for specific information)
    2. Model knowledge (only to fill gaps or provide context)
    No web search results are available for this query.
    """
            elif used_web_search and not context_docs and not use_model_knowledge:
                source_priorities = """
    # KNOWLEDGE SOURCE PRIORITIES
    For this query, ONLY use web search results.
    No document sources are available.
    DO NOT use model knowledge even if the web search seems insufficient.
    """
            elif not used_web_search and context_docs and not use_model_knowledge:
                source_priorities = """
    # KNOWLEDGE SOURCE PRIORITIES
    For this query, ONLY use the provided document content.
    DO NOT use model knowledge even if the documents seem insufficient.
    If the documents don't contain the answer, clearly state this limitation.
    """
            elif not used_web_search and not context_docs and use_model_knowledge:
                source_priorities = """
    # KNOWLEDGE SOURCE PRIORITIES
    For this query, you must rely solely on your built-in knowledge.
    No documents or web search results are available.
    """
            
            # ==========================================
            # Step 4: Build context content with clear section organization
            # ==========================================
            
            # Create context sections with clear headers
            context_sections = []
            
            # Information sources header
            if sources_used:
                context_sections.append(f"## Information Sources\nThis response uses information from: {', '.join(sources_used)}.")
            
            # Add web content if available and used
            if used_web_search and web_content:
                context_sections.append(web_content)
            
            # Add document content if available and used
            if context_docs:
                try:
                    # Analyze and categorize documents by relevance
                    highly_relevant = []
                    somewhat_relevant = []
                    tangentially_relevant = []
                    
                    # Score documents for relevance
                    question_terms = [term.lower() for term in question.split() if len(term) > 2]
                    for doc in context_docs:
                        # Calculate relevance score
                        relevance = 0
                        content_lower = doc.page_content.lower()
                        
                        # Check for exact phrases
                        if question.lower() in content_lower:
                            relevance += 5
                        
                        # Count matching terms
                        for term in question_terms:
                            if term in content_lower:
                                relevance += 1
                                # Bonus for terms appearing in first 200 chars
                                if term in content_lower[:200]:
                                    relevance += 0.5
                        
                        # Categorize based on relevance score
                        if relevance >= 4:
                            highly_relevant.append(doc)
                        elif relevance >= 2:
                            somewhat_relevant.append(doc)
                        else:
                            tangentially_relevant.append(doc)
                except Exception as e:
                    logger.error(f"Error categorizing documents: {str(e)}")
                    # Fallback to simple categorization
                    highly_relevant = context_docs[:int(len(context_docs)/3)]
                    somewhat_relevant = context_docs[int(len(context_docs)/3):int(2*len(context_docs)/3)]
                    tangentially_relevant = context_docs[int(2*len(context_docs)/3):]
                
                # Log document categorization 
                logger.info(f"Document categorization: {len(highly_relevant)} highly relevant, " +
                            f"{len(somewhat_relevant)} somewhat relevant, " +
                            f"{len(tangentially_relevant)} tangentially relevant")
                
                # Group by source for better organization
                def group_by_source(docs):
                    """Group documents by source"""
                    by_source = {}
                    for doc in docs:
                        try:
                            source = doc.metadata.get('source', 'Unknown') if hasattr(doc, 'metadata') else 'Unknown'
                            if source not in by_source:
                                by_source[source] = []
                            by_source[source].append(doc)
                        except Exception as e:
                            logger.error(f"Error grouping document: {str(e)}")
                    return by_source
                
                # Add document context header
                context_sections.append("## Document Sources:")
                
                # Add highly relevant content first
                if highly_relevant:
                    context_sections.append("### Primary Relevant Information:")
                    try:
                        high_rel_by_source = group_by_source(highly_relevant)
                        
                        for source, docs in high_rel_by_source.items():
                            # Sort docs by page number if available
                            docs.sort(key=lambda d: d.metadata.get('page', 0) if hasattr(d, 'metadata') else 0)
                            date_info = ""
                            if docs:
                                dates = self.extract_document_dates(docs[0])
                                if dates:
                                    if 'file_modified' in dates:
                                        date_info = f" (Last modified: {dates['file_modified']})"
                                    elif 'content_dates' in dates:
                                        date_info = f" (Document date: {dates['content_dates'][0]})"
                                    elif 'text_dates' in dates:
                                        date_info = f" (Document date: {dates['text_dates'][0]})"
                            # Add source header
                            context_sections.append(f"#### Information from {source}:{date_info}")
                            
                            # Add content from each doc
                            for doc in docs:
                                # Extract content (handling the filename prefix we added)
                                content = doc.page_content
                                if content.startswith(f"Filename: {source}"):
                                    content = content.split("\n\n", 1)[1] if "\n\n" in content else content
                                
                                # Add page info if available
                                page = doc.metadata.get('page', '') if hasattr(doc, 'metadata') else ''
                                page_info = f" (Page {page})" if page else ""
                                
                                # Add formatted content
                                context_sections.append(f"Content{page_info}:\n{content}\n")
                    except Exception as e:
                        logger.error(f"Error formatting highly relevant documents: {str(e)}")
                        # Fallback to simple formatting
                        for doc in highly_relevant[:3]:
                            context_sections.append(f"Content:\n{doc.page_content}\n")
                
                # Add somewhat relevant content next
                if somewhat_relevant:
                    context_sections.append("### Additional Information:")
                    try:
                        somewhat_rel_by_source = group_by_source(somewhat_relevant)
                        
                        for source, docs in somewhat_rel_by_source.items():
                            # Sort by page number
                            docs.sort(key=lambda d: d.metadata.get('page', 0) if hasattr(d, 'metadata') else 0)
                            date_info = ""
                            if docs:
                                dates = self.extract_document_dates(docs[0])
                                if dates:
                                    if 'file_modified' in dates:
                                        date_info = f" (Last modified: {dates['file_modified']})"
                                    elif 'content_dates' in dates:
                                        date_info = f" (Document date: {dates['content_dates'][0]})"
                                    elif 'text_dates' in dates:
                                        date_info = f" (Document date: {dates['text_dates'][0]})"
                            # Add source info
                            context_sections.append(f"#### Information from {source}:{date_info}")
                            
                            # Add condensed content (first 2 docs or all if just a few)
                            docs_to_add = docs[:2] if len(docs) > 3 else docs
                            for doc in docs_to_add:
                                # Extract content
                                content = doc.page_content
                                if content.startswith(f"Filename: {source}"):
                                    content = content.split("\n\n", 1)[1] if "\n\n" in content else content
                                
                                # Add page info
                                page = doc.metadata.get('page', '') if hasattr(doc, 'metadata') else ''
                                page_info = f" (Page {page})" if page else ""
                                
                                # Add formatted content
                                context_sections.append(f"Content{page_info}:\n{content}\n")
                    except Exception as e:
                        logger.error(f"Error formatting somewhat relevant documents: {str(e)}")
                        # Fallback to simple formatting
                        for doc in somewhat_relevant[:2]:
                            context_sections.append(f"Content:\n{doc.page_content}\n")
                            
                # Add list of all document sources for reference
                try:
                    all_sources = set()
                    for doc in context_docs:
                        if hasattr(doc, 'metadata') and 'source' in doc.metadata:
                            all_sources.add(doc.metadata['source'])
                    
                    if all_sources:
                        context_sections.append(f"\n### All Document Sources Used: {', '.join(sorted(all_sources))}")
                except Exception as e:
                    logger.error(f"Error listing document sources: {str(e)}")
            
            # ==========================================
            # Step 5: Finalize the prompt with all instructions
            # ==========================================
            
            # Build the complete knowledge management instruction set
            knowledge_instructions = (
                knowledge_restriction_instructions + 
                "\n\n" + 
                source_priorities + 
                "\n\n" + 
                response_format_instructions
            )
            
            # Replace the core instructions section with our enhanced version
            modified_prompt = prompt_template.replace(
                "# CORE INSTRUCTIONS",
                knowledge_instructions + "\n\n# CORE INSTRUCTIONS"
            )
            
            # Build final context string
            context = "\n\n".join(context_sections)
            
            # ==========================================
            # Step 6: Generate the answer with error handling
            # ==========================================
            
            try:
                from langchain_core.prompts import PromptTemplate
                from langchain_core.output_parsers import StrOutputParser
                
                # Create the prompt chain
                prompt = PromptTemplate.from_template(modified_prompt)
                chain = prompt | self.llm | StrOutputParser()
                
                # Generate answer with timeout protection
                logger.info(f"Generating answer with context length: {len(context)} characters")
                start_time = time.time()
                
                # Generate the answer
                answer = chain.invoke({"context": context, "question": question})
                elapsed_time = time.time() - start_time
                logger.info(f"Answer generated in {elapsed_time:.2f} seconds")
                
                # ==========================================
                # Step 7: Post-process the answer 
                # ==========================================
                
                # Ensure the answer starts with proper attribution
                if sources_used and not answer.startswith("Based on"):
                    # Determine attribution prefix based on sources
                    prefix = "Based on "
                    
                    if context_docs and used_web_search and use_model_knowledge:
                        prefix += "document content, web search, and model knowledge, "
                    elif context_docs and used_web_search:
                        prefix += "document content and web search, "
                    elif context_docs and use_model_knowledge:
                        prefix += "document content and model knowledge, "
                    elif used_web_search and use_model_knowledge:
                        prefix += "web search and model knowledge, "
                    elif context_docs:
                        prefix += "the provided documents, "
                    elif used_web_search:
                        prefix += "web search results, "
                    elif use_model_knowledge:
                        prefix += "model knowledge, "
                    
                    # Only add the prefix if the answer doesn't already have similar wording
                    attribution_phrases = ["based on", "according to", "from the", "as per"]
                    has_attribution = any(answer.lower().startswith(phrase) for phrase in attribution_phrases)
                    
                    if not has_attribution:
                        # Make the first letter lowercase when adding a prefix
                        if answer and len(answer) > 0:
                            answer = prefix + answer[0].lower() + answer[1:]
                        else:
                            answer = prefix + answer
                
                # Return the final answer
                return answer
                
            except Exception as e:
                error_msg = f"Error generating answer: {str(e)}"
                logger.error(error_msg)
                if self.debug:
                    st.error(error_msg)
                return f"I encountered an error while generating your answer: {str(e)}. Please try again or rephrase your question."
                
        except Exception as e:
            logger.error(f"Critical error in answer_question: {str(e)}")
            return "I'm sorry, I encountered a technical issue. Please try again or contact support if the problem persists."

def get_huggingface_llm(model_name: str, temperature: float = 0.1):
    """Get a LangChain LLM using HuggingFace API for more powerful models"""
    try:
        from langchain_huggingface import HuggingFaceEndpoint
        import os
        
        # Check if we have an API key
        api_key = os.environ.get("HUGGINGFACE_API_KEY")
        if not api_key:
            raise ValueError("Missing HUGGINGFACE_API_KEY environment variable")
        
        # Create the HuggingFace endpoint
        hf_endpoint = HuggingFaceEndpoint(
            endpoint_url=f"https://api-inference.huggingface.co/models/{model_name}",
            huggingfacehub_api_token=api_key,
            task="text-generation",
            model_kwargs={
                "temperature": temperature,
                "max_new_tokens": 1024,
                "do_sample": True,
                "return_full_text": False
            }
        )
        
        return hf_endpoint
    except Exception as e:
        logger.error(f"Error creating HuggingFace endpoint for model {model_name}: {str(e)}")
        return None

async def process_query(query: str, context: List[str] = None) -> str:
    """
    Process a query using the RAG engine
    
    Args:
        query: The user's query
        context: Optional list of context strings
        
    Returns:
        Generated answer text
    """
    try:
        # Default response if we can't process the query
        default_response = "I'm currently in demo mode. In the full version, I can provide personalized market analysis and pricing insights based on your specific industry data. Would you like to learn more about our full AI assistant capabilities?"
        
        # For now, we'll return a simple response based on the query type
        # In a real implementation, this would use an LLM to generate answers based on the context
        if "price" in query.lower() or "cost" in query.lower() or "pricing" in query.lower():
            return "Based on our latest market analysis, similar products in this sector are priced between $450-550. This represents a 5% increase from last quarter."
        elif "market" in query.lower() or "industry" in query.lower() or "trend" in query.lower():
            return "The market for this product category has grown 12% year-over-year. Key trends include increased demand for sustainable options and integrated smart features."
        elif "competitor" in query.lower() or "competition" in query.lower():
            return "Your top three competitors in this space are Acme Corp (34% market share), Innovatech (22%), and PrimeProducts (15%). Your current position is 4th with 11%."
        elif "forecast" in query.lower() or "prediction" in query.lower() or "future" in query.lower():
            return "Our models forecast a 8-10% growth in this segment over the next 18 months, with particularly strong performance expected in Q2 and Q3 of next year."
        
        # Default response for other queries
        return default_response
    except Exception as e:
        logging.error(f"Error in process_query: {str(e)}")
        return "I apologize, but I'm having trouble processing your query right now. I'm operating in demo mode with limited functionality."

async def retrieve_context(query: str) -> List[str]:
    """
    Retrieve context from the vector store based on the query
    
    Args:
        query: The user's query
        
    Returns:
        List of context strings
    """
    try:
        # This is a stub implementation
        # In a real implementation, this would query a vector store to find relevant documents
        
        # For now, return empty context
        return []
    except Exception as e:
        logging.error(f"Error in retrieve_context: {str(e)}")
        return []

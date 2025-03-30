
interface SupportedFileTypesProps {
  fileTypes?: string[];
}

const SupportedFileTypes = ({ 
  fileTypes = [".PDF", ".DOCX", ".XLSX", ".PPTX", ".TXT", ".SAS"]
}: SupportedFileTypesProps) => {
  return (
    <>
      <h4 className="text-sm font-medium">Supported File Types</h4>
      <div className="flex flex-wrap gap-2">
        {fileTypes.map((type) => (
          <div key={type} className="bg-muted px-2.5 py-1 rounded text-xs font-medium">
            {type}
          </div>
        ))}
      </div>
    </>
  );
};

export default SupportedFileTypes;

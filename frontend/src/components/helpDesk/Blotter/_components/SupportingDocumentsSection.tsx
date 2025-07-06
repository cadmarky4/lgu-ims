import type { CreateBlotter } from "@/services/helpDesk/blotters/blotters.types";
import { AlertCircle, Plus, Upload, X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

export const SupportingDocumentsSection = () => {
    const { control, register, formState: { errors }, setValue, watch } = useFormContext<CreateBlotter>();
    const { fields, append, remove } = useFieldArray({
      control,
      name: 'blotter.supporting_documents'
    });
  
    const addDocument = () => {
      append({
        url: ''
      });
    };
  
    const handleFileUpload = (index: number, file: File) => {
      // In a real app, you would upload the file to your server
      // For now, we'll just create a mock URL
      const mockUrl = `https://example.com/documents/${file.name}`;
      setValue(`blotter.supporting_documents.${index}.url`, mockUrl);
    };
  
    return (
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Supporting Documents ({fields.length})
          </h3>
          <button
            type="button"
            onClick={addDocument}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Document
          </button>
        </div>
  
        {fields.length === 0 ? (
          <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>No documents added yet</p>
            <p className="text-sm">Click "Add Document" to include evidence files</p>
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border border-gray-200 rounded-lg bg-gray-50"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        Document #{index + 1}
                      </span>
                    </div>
                    
                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload File
                      </label>
                      <input
                        type="file"
                        accept="image/*,application/pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(index, file);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    {/* URL (hidden field, populated by file upload) */}
                    <input
                      {...register(`blotter.supporting_documents.${index}.url`)}
                      type="hidden"
                    />
                    
                    {/* Display current URL if exists */}
                    {watch(`blotter.supporting_documents.${index}.url`) && (
                      <div className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                        <p className="text-green-800">
                          ✓ File uploaded: {watch(`blotter.supporting_documents.${index}.url`)}
                        </p>
                      </div>
                    )}
                    
                    {errors.blotter?.supporting_documents?.[index]?.url && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.blotter.supporting_documents[index]?.url?.message}
                      </p>
                    )}
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="cursor-pointer p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                    title="Remove document"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
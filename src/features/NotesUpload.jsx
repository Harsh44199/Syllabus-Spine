import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const NotesUpload = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Upload the file to the 'notes-files' bucket
      let { error: uploadError } = await supabase.storage
        .from('notes-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get the public URL for the database
      const { data } = supabase.storage.from('notes-files').getPublicUrl(filePath);

      // 3. Save the record to your 'notes' table
      const { error: dbError } = await supabase
        .from('notes')
        .insert([{ 
          title: file.name.replace('.pdf', ''), 
          file_url: data.publicUrl,
          category: 'Digital' 
        }]);

      if (dbError) throw dbError;
      
      alert('Note Uploaded Successfully!');
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white border-2 border-dashed border-slate-200 rounded-3xl text-center">
      <label className="cursor-pointer block">
        <span className="text-sm font-bold text-slate-600 block mb-2">
          {uploading ? 'Processing File...' : 'Upload New PDF Note'}
        </span>
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={uploadFile} 
          disabled={uploading}
          className="hidden" 
        />
        <div className="bg-blue-50 text-blue-600 py-3 rounded-xl font-bold hover:bg-blue-100 transition-all">
          {uploading ? '⬆️ Uploading...' : 'Select PDF File'}
        </div>
      </label>
    </div>
  );
};

export default NotesUpload;
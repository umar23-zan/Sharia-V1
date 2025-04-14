// src/components/BlogAdmin.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4 border-b pb-2">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'font-bold text-blue-600' : ''}>Bold</button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'italic text-blue-600' : ''}>Italic</button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'line-through text-blue-600' : ''}>Strike</button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'underline text-blue-600' : ''}>Underline</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'text-lg font-bold text-blue-600' : ''}>H2</button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'text-blue-600' : ''}>Bullet List</button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'text-blue-600' : ''}>Numbered List</button>
      <button onClick={() => editor.chain().focus().undo().run()}>Undo</button>
      <button onClick={() => editor.chain().focus().redo().run()}>Redo</button>
    </div>
  );
};

const BlogAdmin = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: 'Admin',
    content: '',
    faqs: [{ question: '', answer: '' }]
  });

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: '',
    onUpdate: ({ editor }) => {
      setFormData({ ...formData, content: editor.getHTML() });
    }
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...formData.faqs];
    updatedFaqs[index][field] = value;
    setFormData({ ...formData, faqs: updatedFaqs });
  };

  const addFaq = () => {
    setFormData({ ...formData, faqs: [...formData.faqs, { question: '', answer: '' }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/blogs', formData);
      alert('Blog posted successfully!');
      setFormData({
        title: '',
        author: 'Admin',
        content: '',
        faqs: [{ question: '', answer: '' }]
      });
      editor.commands.setContent('');
    } catch (err) {
      console.error(err);
      alert('Failed to post blog.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Create New Blog</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Blog Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <h3 className="mb-2 text-lg font-medium">Blog Content</h3>
        <MenuBar editor={editor} />
        <div className="border rounded p-2 mb-4 min-h-[200px]">
          <EditorContent editor={editor} />
        </div>

        <h3 className="text-lg font-medium mb-2">FAQs</h3>
        {formData.faqs.map((faq, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              placeholder="Question"
              value={faq.question}
              onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
              className="w-full p-2 mb-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Answer"
              value={faq.answer}
              onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addFaq}
          className="px-4 py-2 mb-4 bg-gray-200 rounded hover:bg-gray-300"
        >
          Add Another FAQ
        </button>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Post Blog
        </button>
      </form>
    </div>
  );
};

export default BlogAdmin;

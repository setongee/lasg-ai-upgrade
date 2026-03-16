import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { frontend_url } from '../../../../api/read/environment';
import { api } from './api';
import { FormBuilder } from './pages/FormBuilder';
import { FormPreviewPage } from './pages/FormPreviewPage';
import { FormsListPage } from './pages/FormsListPage';
import { ResponseDetailPage } from './pages/ResponseDetailPage';
import { ResponsesListPage } from './pages/ResponsesListPage';

export default function FormsZone() {
  const [view, setView] = useState('list');
  const [forms, setForms] = useState([]);
  const [editingForm, setEditingForm] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const { mda } = useParams();

  // data fetching method
  const { data, isLoading, error } = useQuery({
    queryKey: ['forms', view],
    queryFn: () => api.getFormsByMda(mda),
  });

  useEffect(() => {
    if (data) {
      setForms(data?.data);
    }
  }, [data]);

  // ─── Navigation handlers ───
  const handleCreateNew = () => {
    setEditingForm(null);
    setView('builder');
  };

  const handleEdit = (form) => {
    setEditingForm(form);
    setView('builder');
  };

  const handleViewResponses = (form) => {
    setSelectedForm(form);
    setView('responses');
  };

  const handleCopyPublicUrl = (form) => {
    const publicUrl = `${frontend_url}/${form.mda}/forms/${form._id}`;
    navigator.clipboard
      .writeText(publicUrl)
      .then(() => {
        alert('Public URL copied to clipboard!');
      })
      .catch(() => {
        alert('Failed to copy URL');
      });
  };

  const handlePreview = (form) => {
    setSelectedForm(form);
    setView('preview');
  };

  const handleViewResponse = (resp) => {
    setSelectedResponse(resp);
    setView('response_detail');
  };

  // ─── CRUD handlers ───
  const handleDelete = async (id) => {
    await api.deleteForm(id);
    setForms(forms.filter((f) => f._id !== id));
  };

  const handleSave = async (formData) => {
    if (editingForm) {
      await api.updateForm(editingForm._id, formData);
      setForms(forms.map((f) => (f._id === editingForm._id ? { ...f, ...formData } : f)));
    } else {
      const nf = await api.createForm(formData);
      setForms([nf, ...forms]);
    }
    setView('list');
    setEditingForm(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {view === 'list' && (
        <FormsListPage
          forms={forms}
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
          onViewResponses={handleViewResponses}
          onDelete={handleDelete}
          onPreview={handlePreview}
          onCopyPublicUrl={handleCopyPublicUrl}
        />
      )}

      {view === 'builder' && (
        <FormBuilder
          form={editingForm}
          onSave={handleSave}
          onCancel={() => {
            setView('list');
            setEditingForm(null);
          }}
        />
      )}

      {view === 'responses' && selectedForm && (
        <ResponsesListPage
          form={selectedForm || {}}
          onBack={() => setView('list')}
          onViewResponse={handleViewResponse}
        />
      )}

      {view === 'response_detail' && selectedResponse && selectedForm && (
        <ResponseDetailPage
          response={selectedResponse}
          form={selectedForm}
          onBack={() => setView('responses')}
        />
      )}

      {view === 'preview' && selectedForm && (
        <FormPreviewPage form={selectedForm} onClose={() => setView('list')} />
      )}
    </div>
  );
}

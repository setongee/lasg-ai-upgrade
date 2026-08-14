import { useState } from 'react';
import { registerEvent } from '../../../../api/read/events.req';

const EventRsvp = ({ eventId }) => {
  const [form, setForm] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('idle'); // idle | saving | done | error
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    setStatus('saving');
    registerEvent(eventId, form)
      .then((response) => {
        if (response.status === 'bad') {
          setStatus('error');
          setMessage(response.message);
        } else {
          setStatus('done');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      });
  };

  if (status === 'done') {
    return (
      <div className="rounded-2xl bg-green-50 border border-green-100 p-6 text-green-800 text-[14px]">
        You're registered for this event. See you there!
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-gray-50 p-6 flex flex-col gap-4 mt-4"
    >
      <h3 className="font-semibold text-[16px]">RSVP for this event</h3>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          name="name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          required
          className="flex-1 p-4 text-[14px] border-none outline-none bg-white rounded-lg"
        />
        <input
          type="email"
          name="email"
          placeholder="Your email"
          value={form.email}
          onChange={handleChange}
          required
          className="flex-1 p-4 text-[14px] border-none outline-none bg-white rounded-lg"
        />
      </div>

      {status === 'error' && <p className="text-[13px] text-red-600">{message}</p>}

      <button
        type="submit"
        disabled={status === 'saving'}
        className="self-start py-3 px-6 rounded-lg bg-[var(--theme-accent,#15803d)] text-[var(--theme-accent-text,#ffffff)] text-[13px] font-bold cursor-pointer disabled:opacity-60"
      >
        {status === 'saving' ? 'Registering...' : 'Confirm RSVP'}
      </button>
    </form>
  );
};

export default EventRsvp;

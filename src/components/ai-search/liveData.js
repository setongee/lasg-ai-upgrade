// Live government data the assistant and the "narrow to" picker both need:
// the executive council, the MDA directory and the service categories.
// Fetched once per page load and shared (a failed fetch is retried next time).
import axios from 'axios';
import { getAllMembers } from '../../api/read/executives.req';
import { getAllMdas } from '../../api/read/mda.req';
import { env } from '../../api/read/environment';

let pending = null;

const safe = async (fn, fallback) => {
  try {
    return await fn();
  } catch (err) {
    console.error('[ai-search] live data fetch failed:', err?.message || err);
    return fallback;
  }
};

const fetchCategories = async () => {
  const res = await axios.get(`${env}/category/all`);
  const data = res.data?.data || res.data || [];
  return (Array.isArray(data) ? data : [])
    .map((c) => ({ name: String(c.name || '').trim(), formattedName: c.formattedName }))
    .filter((c) => c.name && c.formattedName);
};

export const loadLiveData = () => {
  if (!pending) {
    pending = Promise.all([safe(getAllMembers, []), safe(getAllMdas, []), safe(fetchCategories, [])]).then(
      ([members, mdas, categories]) => {
        // Nothing came back at all (offline / API down) — allow a retry next call.
        if (!members?.length && !mdas?.length && !categories?.length) pending = null;

        return {
          executives: (Array.isArray(members) ? members : []).map((m) => ({
            name: m.fullname || m.name || 'N/A',
            position: m.position || 'N/A',
          })),
          mdas: (Array.isArray(mdas) ? mdas : [])
            .filter((m) => m && m._id && m.name)
            .map((m) => ({
              id: String(m._id),
              name: String(m.name).trim(),
              subdomain: m.subdomain || '',
              type: m.type || '',
              description: m.description || '',
            })),
          categories: categories || [],
        };
      }
    );
  }
  return pending;
};

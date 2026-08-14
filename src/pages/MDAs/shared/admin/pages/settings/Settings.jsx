import { Key, ProfileCircle } from 'iconoir-react';
import { useEffect, useState } from 'react';
import { notify } from '../../../../../../utils/toast';
import { changePassword } from '../../../../api/auth/auth';
import Loader from '../../../../shared/loader/loader';

const FIELD_LABEL_CLASS = 'text-gray-700 text-[14px]';
const FIELD_DESCRIPTION_CLASS = 'text-gray-400 text-[14px]';
const FIELD_GROUP_CLASS = 'flex flex-col gap-3 border-b border-gray-100 pb-6';
const INPUT_CLASS =
  'p-5 w-full text-[15px] leading-[23px] border-none outline-none bg-gray-50 rounded-lg';

const emptyPasswordForm = { current: '', next: '', confirm: '' };

const Settings = () => {
  const [account, setAccount] = useState({ firstname: '', lastname: '', role: '', mda: '', id: '' });
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem('MDA__TOKEN');
    if (!stored) return;

    const parsed = JSON.parse(stored);
    setAccount({
      firstname: parsed.firstname || '',
      lastname: parsed.lastname || '',
      role: parsed.role || '',
      mda: parsed.mda || '',
      id: parsed.id || '',
    });
  }, []);

  const onPasswordChange = (e) => {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordSubmit = async () => {
    if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
      notify.error('Please fill in all password fields');
      return;
    }

    if (passwordForm.next.length < 8) {
      notify.error('New password must be at least 8 characters');
      return;
    }

    if (passwordForm.next !== passwordForm.confirm) {
      notify.error('New password and confirmation do not match');
      return;
    }

    setIsSaving(true);

    changePassword(account.id, passwordForm.current, passwordForm.next)
      .then((res) => {
        if (res.status === 'ok') {
          notify.success(res.message || 'Password updated successfully');
          setPasswordForm(emptyPasswordForm);
        } else {
          notify.error(res.message || 'Failed to update password');
        }
      })
      .catch((err) => {
        notify.error(err.message || 'Failed to update password. Please try again.');
      })
      .finally(() => setIsSaving(false));
  };

  return (
    <div className="flex flex-col gap-6 w-[700px] mx-auto">
      {isSaving ? <Loader customClass="" /> : null}

      {/* account */}
      <div className="flex items-center gap-4 bg-white rounded-lg p-8">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
          <ProfileCircle width={26} height={26} />
        </div>
        <div>
          <p className="text-[16px] font-semibold text-gray-900">
            {account.firstname} {account.lastname}
          </p>
          <p className="text-[13px] text-gray-500 capitalize">
            {account.role} {account.mda ? `· ${account.mda}` : ''}
          </p>
        </div>
      </div>

      {/* password */}
      <div className="flex flex-col relative bg-white w-full rounded-lg p-8 gap-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            Update the password used to sign in to this admin portal.
          </h2>
        </div>

        <div className={FIELD_GROUP_CLASS}>
          <div className={FIELD_LABEL_CLASS}>
            <p className="font-bold">Current Password</p>
            <span className={FIELD_DESCRIPTION_CLASS}>Confirm it's you before changing anything.</span>
          </div>

          <input
            type="password"
            name="current"
            placeholder="Enter current password"
            value={passwordForm.current}
            onChange={onPasswordChange}
            className={INPUT_CLASS}
            autoComplete="current-password"
          />
        </div>

        <div className={FIELD_GROUP_CLASS}>
          <div className={FIELD_LABEL_CLASS}>
            <p className="font-bold">New Password</p>
            <span className={FIELD_DESCRIPTION_CLASS}>Use at least 8 characters.</span>
          </div>

          <input
            type="password"
            name="next"
            placeholder="Enter new password"
            value={passwordForm.next}
            onChange={onPasswordChange}
            className={INPUT_CLASS}
            autoComplete="new-password"
          />
        </div>

        <div className={FIELD_GROUP_CLASS}>
          <div className={FIELD_LABEL_CLASS}>
            <p className="font-bold">Confirm New Password</p>
          </div>

          <input
            type="password"
            name="confirm"
            placeholder="Re-enter new password"
            value={passwordForm.confirm}
            onChange={onPasswordChange}
            className={INPUT_CLASS}
            autoComplete="new-password"
          />
        </div>

        <div className="flex text-black">
          <div className="flex gap-[10px]">
            <button
              className="py-[12px] pl-[15px] pr-5 text-white text-[13px] font-bold rounded-[5px] cursor-pointer bg-green-700 ml-auto flex items-center gap-1 disabled:opacity-60"
              onClick={handlePasswordSubmit}
              disabled={isSaving}
            >
              <Key fontSize={12} strokeWidth={2} />
              {isSaving ? 'Saving...' : 'Update Password'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

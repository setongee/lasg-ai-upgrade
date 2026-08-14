import { useState } from 'react';
import { addSubscriber } from '../../../../api/read/subscribers.req';
import { useThemeStore } from '../../stores/theme.store';
import Button from '../button/Button';
import './newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const mdaId = useThemeStore((state) => state.mdaData)?._id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const result = await addSubscriber({
        email,
        mdaDirectory: mdaId,
      });

      if (result.success) {
        setMessage('Successfully subscribed!');
        setEmail('');
      } else {
        setMessage(result.message || 'Subscription failed');
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="newsletter-section flex justify-center items-center bg-[var(--theme-accent,#2e7d32)] rounded-[10px] p-[30px] md:p-[50px] lg:p-[80px] my-[70px] md:my-[100px] mb-[50px] overflow-hidden relative"
    >
      <div className="newsletter-inner flex flex-col lg:flex-row items-center justify-between w-full text-[var(--theme-accent-text,#ffffff)] gap-[30px]">
        {/* Left section - Title */}
        <div className="newsletter-title text-[22px] sm:text-[24px] lg:text-[28px] font-semibold leading-[125%] md:w-[300px] lg:w-[550px] text-center lg:text-left relative z-[1]">
          Subscribe to our newsletter to get updates to your inbox 📨
        </div>

        {/* Right section - Input + Button */}
        <div className="newsletter-form flex items-center justify-center gap-[10px] rounded-[5px] backdrop-blur-sm p-[2px] flex-wrap md:flex-nowrap">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="newsletter-input w-full md:w-[320px] p-[14px] rounded-[5px] outline-none text-[var(--theme-accent-text,#ffffff)] glass-card h-[55px] md:h-[60px]"
            disabled={isLoading}
          />

          <Button
            action={handleSubmit}
            customClass="newsletter-button bg-[var(--theme-shade,#1c3f3a)] text-white flex items-center justify-center gap-2 rounded-[5px] px-[20px] py-[12px] !w-full md:max-w-max h-[55px] md:h-[60px]"
            disabled={isLoading}
          >
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BinFull } from 'iconoir-react';
import { useState } from 'react';
import { deleteSubscriber, getSubsciptionsByMda } from '../../../../../../api/read/subscribers.req';
import { formatDate3 } from '../../../../../../middleware/middleware';
import { useThemeStore } from '../../../../stores/theme.store';
import ConfirmModal from '../../../confirmModal/confirm-modal';
import Loader from '../../../loader/loader';

const Subscribers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState(null);
  const mdaData = useThemeStore((state) => state?.mdaData);
  const queryClient = useQueryClient();

  const {
    data: subscribers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['subscribers', mdaData?._id],
    queryFn: () => getSubsciptionsByMda(mdaData?._id),
    enabled: !!mdaData?._id,
  });

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading subscribers</p>
          <p className="text-gray-500 text-sm">Please try again later</p>
        </div>
      </div>
    );
  }

  if (isLoading || !subscribers) {
    return <Loader />;
  }

  const filteredSubscribers =
    subscribers?.data?.filter((subscriber) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return subscriber.email.toLowerCase().includes(searchLower);
    }) || [];

  const getAvatarColor = (email) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500',
    ];

    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getInitial = (email) => {
    return email.charAt(0).toUpperCase();
  };

  const handleDelete = (subscriber) => {
    setSubscriberToDelete(subscriber);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (subscriberToDelete) {
      await deleteSubscriber(subscriberToDelete._id);
      queryClient.invalidateQueries(['subscribers', mdaData?._id]);
      setShowDeleteModal(false);
      setSubscriberToDelete(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!filteredSubscribers.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[75vh] gap-5">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 40 40"
            height="40"
            width="40"
          >
            <desc>Mail Streamline Icon: https://streamlinehq.com</desc>
            <g id="Mail--Streamline-Solar">
              <path
                id="Vector"
                fill="#374151"
                d="M3.3333333333333335 10.833333333333334c0 -2.3011666666666668 1.8655 -4.166666666666667 4.166666666666667 -4.166666666666667h25c2.3011666666666668 0 4.166666666666667 1.8655 4.166666666666667 4.166666666666667v18.333333333333332c0 2.3011666666666668 -1.8655 4.166666666666667 -4.166666666666667 4.166666666666667h-25c-2.3011666666666668 0 -4.166666666666667 -1.8655 -4.166666666666667 -4.166666666666667v-18.333333333333332Z"
                strokeWidth="1.6667"
              ></path>
              <path
                id="Vector_2"
                fill="#ffffff"
                d="M3.3333333333333335 11.666666666666668c0.6448333333333334 -0.6448333333333334 1.6891666666666667 -0.6448333333333334 2.3333333333333335 0l11.666666666666666 11.666666666666666c0.6448333333333334 0.6448333333333334 1.6891666666666667 0.6448333333333334 2.3333333333333335 0l11.666666666666666 -11.666666666666666c0.6448333333333334 -0.6448333333333334 1.6891666666666667 -0.6448333333333334 2.3333333333333335 0s0.6448333333333334 1.6891666666666667 0 2.3333333333333335l-11.666666666666666 11.666666666666666c-1.9345 1.9345 -5.067833333333333 1.9345 -7 0L3.3333333333333335 14c-0.6448333333333334 -0.6448333333333334 -0.6448333333333334 -1.6891666666666667 0 -2.3333333333333335Z"
                strokeWidth="1.6667"
              ></path>
            </g>
          </svg>
        </div>
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-[20px] font-semibold">No Subscribers Yet</h1>
          <p className="text-[14px] text-gray-500 w-[400px] text-center">
            You don't have any subscribers yet. Users will appear here when they subscribe to your
            updates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="titleAdmin flex items-center justify-between">
        <div className="flex gap-[10px]">
          <div className="searchField h-[100%] relative">
            <input
              type="text"
              placeholder="Search subscribers..."
              className="py-[15px] pl-[45px] pr-[20px] rounded-[5px] w-[450px] bg-[#f5f5f5] text-[14px] h-full focus:outline-none focus:ring-1 focus:ring-[#27ae60] focus:border-transparent transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mt-20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wider">
                  Email Address
                </th>
                <th className="px-6 py-4 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wider">
                  Date Subscribed
                </th>
                <th className="px-6 py-4 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSubscribers.map((subscriber, index) => (
                <tr key={subscriber._id || index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full ${getAvatarColor(subscriber.email)} flex items-center justify-center text-white font-semibold text-sm`}
                      >
                        {getInitial(subscriber.email)}
                      </div>
                      <span className="text-sm text-gray-900 font-medium">{subscriber.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {formatDate3(subscriber.createdAt)}
                    </span>
                  </td>
                  <td className="px-6 py-4 align-middle">
                    <div
                      className="px-3.5 py-1.5 pl-1.5 rounded flex items-center justify-center gap-0.5 bg-gray-100 w-[max-content]  hover:text-red-600 hover:bg-red-50 cursor-pointer"
                      onClick={() => handleDelete(subscriber)}
                    >
                      <button
                        className="p-1.5 rounded-md transition-colors cursor-pointer"
                        title="Delete subscriber"
                      >
                        <BinFull width={16} height={16} />
                      </button>
                      <p className="text-[14px]">Unsubscribe</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSubscribers.length === 0 && searchTerm && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No subscribers found matching "{searchTerm}"</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          Showing {filteredSubscribers.length} of {subscribers?.data?.length || 0} subscribers
        </div>
        {filteredSubscribers.length > 0 && (
          <div className="text-xs text-gray-500">
            Last updated: {formatDate3(subscribers?.data?.[0]?.updatedAt || new Date())}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmModal
          onClose={() => setShowDeleteModal(false)}
          open={showDeleteModal}
          contentStyling="lg:!w-[400px] md:!w-[90%]"
          onConfirm={confirmDelete}
        >
          <h1>
            Are you sure you want to delete <strong>"{subscriberToDelete?.email}"</strong>?
          </h1>
          <p className="mt-3 text-[14px] text-gray-500">
            This action cannot be undone. Once deleted, the subscriber will be permanently removed
            from your list.
          </p>
        </ConfirmModal>
      )}
    </div>
  );
};

export default Subscribers;

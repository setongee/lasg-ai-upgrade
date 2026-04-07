import { ArrowDown, ArrowUpRight, IconoirProvider } from 'iconoir-react';
import line from '../../../assets/icons/random/line__lasg.svg';
import Container from '../../../components/container/container';
import '../../../styles/components/quickService/quickService.scss';

// Card data array for better maintainability
const quickCheckCards = [
  {
    id: 'housing',
    title: 'Find Housing & Property Services in Lagos',
    description:
      'Access housing permits, land services, and property management solutions in Lagos.',
    image:
      'https://res.cloudinary.com/dirmxkznt/image/upload/q_auto/f_auto/v1775550824/housing-lagos_cw0gvs.jpg',
    attr: 'Photo by <a href="https://unsplash.com/@joaccord?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Joshua Oluwagbemiga</a> on <a href="https://unsplash.com/photos/beige-and-brown-concrete-house-under-blue-sky--W9baa2VIBU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>',
    href: '/services/housingandlands',
    buttonText: 'View Services',
    delay: 0.1,
  },
  {
    id: 'tourism',
    title: 'Find and Explore Tourism & Visitor Services',
    description:
      'Access tourism, travel, and visitor services designed to help you experience the best of Lagos.',
    image:
      'https://res.cloudinary.com/dirmxkznt/image/upload/q_auto/f_auto/v1775550825/tourism_sn31vi.jpg',
    attr: 'Photo by <a href="https://unsplash.com/@joaccord?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Joshua Oluwagbemiga</a> on <a href="https://unsplash.com/photos/beige-and-brown-concrete-house-under-blue-sky--W9baa2VIBU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>',
    href: '/services/tourism_culture',
    buttonText: 'View Services',
    delay: 0.2,
  },
  {
    id: 'jobs',
    title: 'Discover Work & Employment Services in Lagos',
    description:
      'Access employment, business, and regulatory services driving sustainable growth in Lagos.',
    image:
      'https://res.cloudinary.com/dirmxkznt/image/upload/q_auto/f_auto/v1775551078/work-lagos_cmd6ou.jpg',
    attr: "Photo by <a href='https://unsplash.com/@ninthgrid_?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText'>Ninthgrid</a> on <a href='https://unsplash.com/photos/a-group-of-people-standing-next-to-each-other-ti8cT-DKwes?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText'>Unsplash</a>",
    href: '/services/jobopportunities',
    buttonText: 'View Services',
    delay: 0.3,
  },
  {
    id: 'education',
    title: 'Find Lagos state Education & School Services',
    description:
      'Access education services, school systems, and learning resources that support excellence across Lagos.',
    image:
      'https://res.cloudinary.com/dirmxkznt/image/upload/q_auto/f_auto/v1775553412/education-lagos_oxebm0.jpg',
    href: '/services/education',
    buttonText: 'Explore Services',
    delay: 0.4,
  },
  {
    id: 'payment',
    title: 'Find and Manage Payments & Government Fees',
    description:
      'Access taxes, levies, fines, and payment services securely and conveniently across Lagos State.',
    image: 'https://res.cloudinary.com/dirmxkznt/image/upload/v1775552306/payment_uqrfp6.jpg',
    attr: '',
    href: '/services/payments_levies',
    buttonText: 'Find Payments',
    delay: 0.5,
  },
  {
    id: 'safety',
    title: 'Find and Manage Safety & Emergency Services',
    description:
      'Access security, emergency response, and public safety services whenever you need them most quickly.',
    image:
      'https://res.cloudinary.com/dirmxkznt/image/upload/q_auto/f_auto/v1775551670/safety_gqnnso.jpg',
    attr: '',
    href: '/services/disasters_emergencies',
    buttonText: 'View Services',
    delay: 0.6,
  },
];

export default function QuickCheck({ darkmode }) {
  const handleServices = () => {
    window.scrollTo({
      top:
        document.querySelector('#services').getBoundingClientRect().top -
        document.body.getBoundingClientRect().top -
        100,
    });
  };

  return (
    <div
      className={`${darkmode ? 'quickCheck darkmode' : 'quickCheck'} bg-gray-50!`}
      id="quickCheck"
    >
      {/* <Controls target="scrollX" /> */}

      <Container>
        <div className="getStarted">
          <div className="textString thick">
            <div className="textChange">
              Find and Access 300+ Essential Public Services in Lagos State
            </div>

            <div className="pasty">
              Access everything you need from payments and permits to registrations and public
              services on a unified digital platform designed to be faster, simpler, and secure.
            </div>
          </div>

          {/* <div className="title"> Get started with Lagos State - </div> */}

          <IconoirProvider
            iconProps={{
              strokeWidth: 2,
              width: 16,
              height: 16,
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-4 lg:gap-6 mt-10 w-full">
              {quickCheckCards.map((card) => (
                <div
                  key={card.id}
                  className="p-5 bg-white rounded-[16px] flex flex-col max-w-110 md:max-w-full mx-auto"
                >
                  <img
                    src={card.image}
                    alt={card.attr}
                    className="w-full h-50 object-cover rounded-lg"
                  />
                  <h3 className="text-[17px] font-semibold w-full xl:w-[75%] leading-[1.45] mt-4">
                    {card.title}
                  </h3>
                  <p className="text-[15px] text-gray-600! mt-2 leading-[1.5]">
                    {card.description}
                  </p>
                  <a
                    className="text-white! flex gap-2 items-center font-medium mt-6 mb-1 text-[14px] bg-green-950 rounded-[6px] px-4 py-2 w-max"
                    href={card.href}
                  >
                    View Services
                    <ArrowUpRight className="text-green-200" />
                  </a>
                </div>
              ))}
            </div>
          </IconoirProvider>

          <div className="linkServices mt-1 bg-white py-3 px-6 rounded-[10px] shadow-gray-100 shadow-lg border border-gray-100 text-[15px] flex gap-2 items-center">
            Ready to explore?{' '}
            <a className="font-semibold! text-gray-700!" onClick={handleServices}>
              Browse all services
            </a>
            <ArrowDown className="text-[10px] ml-1 mt-[2px]" strokeWidth={2.5} />
          </div>
        </div>

        <div className="lineBg">
          <img src={line} alt="" />
        </div>
      </Container>
    </div>
  );
}

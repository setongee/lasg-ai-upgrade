import { ArrowRight } from 'iconoir-react';
import { useNavigate } from 'react-router';
import { truncateText } from '../../../../../middleware/middleware';
import { useEditDataStore } from '../../../stores/editData.store';
import Button from '../../button/Button';
import Wrapper from '../../Wrapper/Wrapper';
import './ResourceCategories.css';

const ResourceCategories = ({ data, isEdit = false, mda, type }) => {
  const navigate = useNavigate();
  const editData = useEditDataStore((state) => state.mdaEditData);

  return (
    <section className={`resource-categories ${type === 'page' && 'page-resource-categories'}`}>
      <Wrapper>
        <div className="resource-categories-header">
          <h2>{data?.title || 'Budget Resources & Documents'}</h2>
          <p>
            {data?.subtitle ||
              'Access comprehensive budget documents, financial statements, and transparency reports'}
          </p>
        </div>
        <div
          className={`budgets__cat ${editData?.cards?.length < 3 && 'justify-center!'} ${type === 'page' ? `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${data?.cards?.length > 2 ? 3 : 2} gap-6` : 'flex'}`}
          id={`${isEdit ? 'page' : 'component'}`}
        >
          {data?.cards?.length > 0 ? (
            data?.cards?.map((card, index) => (
              <div key={index} className="bud__cat">
                <img
                  src={card.image || 'https://openstates.ng/latest/assets/img/implemantation.png'}
                  alt=""
                />
                <div className="naming">
                  <p>
                    {card.title} <ArrowRight width={18} />
                  </p>
                  <span>{truncateText(card.description || '', 100)}</span>
                  <div className="butt">
                    <Button
                      customClass={`bg-[var(--theme-accent,#1c3f3a)] text-[var(--theme-accent-text,#ffffff)] px-4 py-2 rounded-md text-sm font-medium ${
                        isEdit ? 'cursor-not-allowed' : 'hover:opacity-90'
                      }`}
                      action={() =>
                        !isEdit &&
                        navigate(
                          `/${mda}/resources/${card.title.toLowerCase().replace(/\s+/g, '-')}`
                        )
                      }
                    >
                      {card.buttonText || 'View Documents'}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Dummy data fallback
            <>
              <div className="bud__cat">
                <img src="https://openstates.ng/latest/assets/img/implemantation.png" alt="" />
                <div className="naming">
                  <p>
                    Annual Budget Appropiation Bill <ArrowRight width={18} />
                  </p>
                  <span>
                    {truncateText(
                      'The Annual Appropriation Law is Annual Budget (Appropriation Bill) passed by State House of Assembly, and signed into law by Mr. Governor',
                      100
                    )}
                  </span>
                  <div className="butt">
                    <Button
                      customClass={`bg-[var(--theme-accent,#1c3f3a)] text-[var(--theme-accent-text,#ffffff)] px-4 py-2 rounded-md text-sm font-medium ${
                        isEdit ? 'cursor-not-allowed' : 'hover:opacity-90'
                      }`}
                      action={() => !isEdit && navigate(`/${mda}/resources/annual-budget-bill`)}
                    >
                      View Documents
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bud__cat">
                <img src="https://openstates.ng/latest/assets/img/Audited.png" alt="" />
                <div className="naming">
                  <p>
                    Annual Budget Appropriation Law <ArrowRight width={18} />
                  </p>
                  <span>
                    {truncateText(
                      'The Annual Appropriation Bill also known as Annual Budget, is budget as prepared and approved by State Executive Council and presented to State House of Assembly for deliberation and approval',
                      100
                    )}
                  </span>
                  <div className="butt">
                    <Button
                      customClass={`bg-[var(--theme-accent,#1c3f3a)] text-[var(--theme-accent-text,#ffffff)] px-4 py-2 rounded-md text-sm font-medium ${
                        isEdit ? 'cursor-not-allowed' : 'hover:opacity-90'
                      }`}
                      action={() => !isEdit && navigate(`/${mda}/resources/annual-budget-law`)}
                    >
                      View Documents
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bud__cat">
                <img src="https://openstates.ng/approved.png" alt="" />
                <div className="naming">
                  <p>
                    Audited Financial Statement <ArrowRight width={18} />
                  </p>
                  <span>
                    {truncateText(
                      "Lagos state government's audited financial statement is a crucial report that assesses its financial performance and compliance. It provides transparency, accountability, and vital information for budgetary decisions and public trust.",
                      100
                    )}
                  </span>
                  <div className="butt">
                    <Button
                      customClass={`bg-[var(--theme-accent,#1c3f3a)] text-[var(--theme-accent-text,#ffffff)] px-4 py-2 rounded-md text-sm font-medium ${
                        isEdit ? 'cursor-not-allowed' : 'hover:opacity-90'
                      }`}
                      action={() =>
                        !isEdit && navigate(`/${mda}/resources/audited-financial-statement`)
                      }
                    >
                      View Documents
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bud__cat">
                <img src="https://openstates.ng/latest/assets/img/proposed.png" alt="" />
                <div className="naming">
                  <p>
                    States Fiscal Transparency, Accountability, and Sustainability{' '}
                    <ArrowRight width={18} />
                  </p>
                  <span>
                    {truncateText(
                      'The States Fiscal Transparency, Accountability, and Sustainability (SFTAS) scheme was set up to strengthen the fiscal transparency, accountability, and sustainability of the budgetary process for all participating States. Initiated by the Federal government and supported by the World Bank, its goal is to provide grants to States that have complied with the annual eligibility criteria to the extent of their compliance.',
                      100
                    )}
                  </span>
                  <div className="butt">
                    <Button
                      customClass={`bg-[var(--theme-accent,#1c3f3a)] text-[var(--theme-accent-text,#ffffff)] px-4 py-2 rounded-md text-sm font-medium ${
                        isEdit ? 'cursor-not-allowed' : 'hover:opacity-90'
                      }`}
                      action={() => !isEdit && navigate(`/${mda}/resources/sftas`)}
                    >
                      View Documents
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bud__cat">
                <img src="https://openstates.ng/latest/assets/img/citizen.png" alt="" />
                <div className="naming">
                  <p>
                    Citizen Budget
                    <ArrowRight width={18} />
                  </p>
                  <span>
                    {truncateText(
                      "The Citizen's Budget is a short explanation of the approved budget. It breaks down the budget to showcase major plans to be executed for the year for easy consumption by the citizens.",
                      100
                    )}
                  </span>
                  <div className="butt">
                    <Button
                      customClass={`bg-[var(--theme-accent,#1c3f3a)] text-[var(--theme-accent-text,#ffffff)] px-4 py-2 rounded-md text-sm font-medium ${
                        isEdit ? 'cursor-not-allowed' : 'hover:opacity-90'
                      }`}
                      action={() => !isEdit && navigate(`/${mda}/resources/citizen-budget`)}
                    >
                      View Documents
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bud__cat">
                <img src="https://openstates.ng/latest/assets/img/policy.png" alt="" />
                <div className="naming">
                  <p>
                    Quarterly Budget Performance Reviews <ArrowRight width={18} />
                  </p>
                  <span>
                    {truncateText(
                      'The Quarterly Budget Performance Review is designed to evaluate the implementation of the budget to verify if the budget is performing according..',
                      100
                    )}
                  </span>
                  <div className="butt">
                    <Button
                      customClass={`bg-[var(--theme-accent,#1c3f3a)] text-[var(--theme-accent-text,#ffffff)] px-4 py-2 rounded-md text-sm font-medium ${
                        isEdit ? 'cursor-not-allowed' : 'hover:opacity-90'
                      }`}
                      action={() =>
                        !isEdit && navigate(`/${mda}/resources/quarterly-budget-performance`)
                      }
                    >
                      View Documents
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Wrapper>
    </section>
  );
};

export default ResourceCategories;

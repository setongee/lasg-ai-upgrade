import Newsletter from '../../shared/emailLetter/Newsletter';
import Wrapper from '../../shared/Wrapper/Wrapper';

const NewsletterSection = ({
  isEdit = false,
  viewMode = 'view',
  selectedComponent = '',
  onComponentClick = () => {},
}) => {
  return (
    <Wrapper>
      <Newsletter />
    </Wrapper>
  );
};

export default NewsletterSection;

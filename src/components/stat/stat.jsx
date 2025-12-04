import Container from '../container/container';
import './stat.scss';

export default function Stat({ darkmode }) {
  return (
    <Container>
      <div className={`budgetting flex ${darkmode ? 'darkmode' : ''}`}>
        <div className="budget__card">
          <div className="tiny">Est. Population</div>
          <p>22mn+</p>
        </div>

        <div className="divider"></div>

        <div className="budget__card">
          <div className="tiny">Number of Visitors</div>
          <p>1.3mn+</p>
        </div>

        <div className="divider"></div>

        <div className="budget__card">
          <div className="tiny"> State Revenue - 2023 </div>
          <p>N651.2bn</p>
        </div>

        <div className="divider"></div>

        <div className="budget__card">
          <div className="tiny"> vehicles on the road </div>
          <p>5.2mn+</p>
        </div>

        <div className="divider"></div>

        <div className="budget__card">
          <div className="tiny">biggest economy</div>
          <p>6th in Africa</p>
        </div>
      </div>
    </Container>
  );
}

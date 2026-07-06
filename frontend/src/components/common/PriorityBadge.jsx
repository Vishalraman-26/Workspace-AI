import { Badge } from 'react-bootstrap';
import { getPriorityBadge, getPriorityLabel } from '../../utils/constants';

export default function PriorityBadge({ priority, className = '' }) {
  const variant = getPriorityBadge(priority);
  const label = getPriorityLabel(priority);

  return (
    <Badge bg={variant} className={`text-uppercase ${className}`} style={{ fontSize: '0.65rem' }}>
      {label}
    </Badge>
  );
}

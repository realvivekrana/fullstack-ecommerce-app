import Badge from '@/components/ui/Badge';

const STATUS_STYLES = {
  pending: 'outline',
  processing: 'primary',
  shipped: 'dark',
  delivered: 'success',
  cancelled: 'outline',
};

const STATUS_LABELS = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

function OrderStatusBadge({ status }) {
  return <Badge variant={STATUS_STYLES[status] || 'outline'}>{STATUS_LABELS[status] || status}</Badge>;
}

export default OrderStatusBadge;
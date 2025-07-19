import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BriefcaseBusinessIcon,
  CheckCircle,
  Circle,
  CircleOff,
  HelpCircle,
  TagIcon,
  Timer,
  UserIcon,
} from 'lucide-react';

export const labels = [
  {
    value: 'personal',
    label: 'Personal',
    icon: UserIcon,
  },
  {
    value: 'work',
    label: 'Work',
    icon: BriefcaseBusinessIcon,
  },
  {
    value: 'other',
    label: 'Other',
    icon: TagIcon,
  },
];

export const statuses = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: HelpCircle,
  },
  {
    value: 'todo',
    label: 'Todo',
    icon: Circle,
  },
  {
    value: 'in progress',
    label: 'In Progress',
    icon: Timer,
  },
  {
    value: 'done',
    label: 'Done',
    icon: CheckCircle,
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: CircleOff,
  },
];

export const priorities = [
  {
    label: 'Low',
    value: 'low',
    icon: ArrowDown,
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: ArrowRight,
  },
  {
    label: 'High',
    value: 'high',
    icon: ArrowUp,
  },
];

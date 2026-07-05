import ReactTimeAgo from 'react-time-ago';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { Text } from 'react-native';

TimeAgo.addDefaultLocale(en);

type TimeAgoTextProps = {
  children: string;
};

function TimeAgoText({ children }: TimeAgoTextProps) {
  return (
    <Text className="pt-1 text-xs text-gray-500 dark:text-neutral-400">
      {children}
    </Text>
  );
}

type CommentTimeAgoProps = {
  timestamp: number;
};

function CommentTimeAgo({ timestamp }: CommentTimeAgoProps) {
  return (
    <ReactTimeAgo
      date={timestamp}
      locale="en"
      timeStyle="round"
      component={TimeAgoText}
    />
  );
}

export default CommentTimeAgo;

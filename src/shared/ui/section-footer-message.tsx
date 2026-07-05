import { Text } from 'react-native';

type SectionFooterMessageProps = {
  children: string;
};

function SectionFooterMessage({ children }: SectionFooterMessageProps) {
  return (
    <Text className="pb-4 text-center text-gray-500 dark:text-neutral-400">
      {children}
    </Text>
  );
}

export default SectionFooterMessage;

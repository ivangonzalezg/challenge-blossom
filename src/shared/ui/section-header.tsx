import { Text } from 'react-native';

type SectionHeaderProps = {
  title: string;
  count: number;
};

function SectionHeader({ title, count }: SectionHeaderProps) {
  return (
    <Text className="bg-white py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:bg-neutral-950 dark:text-neutral-400">
      {title} ({count})
    </Text>
  );
}

export default SectionHeader;

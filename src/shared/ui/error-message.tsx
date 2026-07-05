import { Text, View } from 'react-native';

type ErrorMessageProps = {
  children: string;
};

function ErrorMessage({ children }: ErrorMessageProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-center text-gray-500 dark:text-neutral-400">
        {children}
      </Text>
    </View>
  );
}

export default ErrorMessage;

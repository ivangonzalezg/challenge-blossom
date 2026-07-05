import { useState } from 'react';
import {
  Image,
  Text,
  View,
  type ImageStyle,
  type StyleProp,
} from 'react-native';

const RETRY_DELAY_MS = 2000;
const MAX_RETRIES = 3;

type AvatarImageProps = {
  uri: string;
  fallbackLabel: string;
  className?: string;
  style?: StyleProp<ImageStyle>;
};

function AvatarImage({
  uri,
  fallbackLabel,
  className,
  style,
}: AvatarImageProps) {
  const [retryCount, setRetryCount] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  function handleError() {
    if (retryCount < MAX_RETRIES) {
      setTimeout(() => {
        setRetryCount(count => count + 1);
      }, RETRY_DELAY_MS);
    }
  }

  return (
    <View
      className={`items-center justify-center bg-violet-600 ${className ?? ''}`}
      style={style}
    >
      <Text className="font-semibold text-white">
        {fallbackLabel.charAt(0).toUpperCase()}
      </Text>
      <Image
        key={retryCount}
        source={{ uri, cache: 'force-cache' }}
        className={`absolute inset-0 ${hasLoaded ? 'opacity-100' : 'opacity-0'} ${className ?? ''}`}
        style={style}
        onError={handleError}
        onLoad={() => setHasLoaded(true)}
      />
    </View>
  );
}

export default AvatarImage;

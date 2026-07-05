import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/shared/ui';

const PROGRESS_TO_LOADING_PERCENT = 85;
const PROGRESS_LOADING_DURATION_MS = 1400;
const PROGRESS_COMPLETE_DURATION_MS = 250;
const EXIT_DURATION_MS = 300;
const WORDMARK_DELAY_MS = 150;
const WORDMARK_DURATION_MS = 400;
const LOGO_PULSE_DURATION_MS = 900;

type AnimatedSplashScreenProps = {
  isReady: boolean;
  onExitComplete: () => void;
};

function AnimatedSplashScreen({
  isReady,
  onExitComplete,
}: AnimatedSplashScreenProps) {
  const logoScale = useSharedValue(0.9);
  const wordmarkOpacity = useSharedValue(0);
  const wordmarkTranslateY = useSharedValue(10);
  const progressPercent = useSharedValue(0);
  const containerOpacity = useSharedValue(1);
  const exitScale = useSharedValue(1);

  useEffect(() => {
    RNBootSplash.hide({ fade: true });
  }, []);

  useEffect(() => {
    logoScale.value = withRepeat(
      withSequence(
        withTiming(1.1, {
          duration: LOGO_PULSE_DURATION_MS,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0.9, {
          duration: LOGO_PULSE_DURATION_MS,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      true,
    );

    wordmarkOpacity.value = withDelay(
      WORDMARK_DELAY_MS,
      withTiming(1, {
        duration: WORDMARK_DURATION_MS,
        easing: Easing.out(Easing.ease),
      }),
    );
    wordmarkTranslateY.value = withDelay(
      WORDMARK_DELAY_MS,
      withTiming(0, {
        duration: WORDMARK_DURATION_MS,
        easing: Easing.out(Easing.ease),
      }),
    );

    progressPercent.value = withTiming(PROGRESS_TO_LOADING_PERCENT, {
      duration: PROGRESS_LOADING_DURATION_MS,
      easing: Easing.out(Easing.ease),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isReady) return;

    progressPercent.value = withTiming(
      100,
      {
        duration: PROGRESS_COMPLETE_DURATION_MS,
        easing: Easing.out(Easing.ease),
      },
      finished => {
        if (!finished) return;

        containerOpacity.value = withTiming(0, {
          duration: EXIT_DURATION_MS,
          easing: Easing.in(Easing.ease),
        });
        exitScale.value = withTiming(
          1.05,
          {
            duration: EXIT_DURATION_MS,
            easing: Easing.in(Easing.ease),
          },
          exitFinished => {
            if (exitFinished) {
              runOnJS(onExitComplete)();
            }
          },
        );
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: exitScale.value }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const wordmarkStyle = useAnimatedStyle(() => ({
    opacity: wordmarkOpacity.value,
    transform: [{ translateY: wordmarkTranslateY.value }],
  }));

  const progressFillStyle = useAnimatedStyle(() => ({
    width: `${progressPercent.value}%`,
  }));

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.container, containerStyle]}
    >
      <View className="flex-1 items-center justify-center">
        <Animated.Image
          source={require('./assets/icon.png')}
          className="h-40 w-40"
          resizeMode="contain"
          style={logoStyle}
        />
        <Animated.View style={wordmarkStyle} className="mt-4">
          <Image
            source={require('./assets/name.png')}
            className="h-12 w-56"
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      <View className="items-center pb-14 px-16">
        <View className="h-1 w-full overflow-hidden rounded-full bg-white/20">
          <Animated.View
            style={[progressFillStyle, { backgroundColor: colors.green500 }]}
            className="h-full rounded-full"
          />
        </View>
        <Text className="mt-3 text-xs text-neutral-400">Loading…</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000409',
  },
});

export default AnimatedSplashScreen;

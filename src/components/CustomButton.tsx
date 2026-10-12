import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../theme/colors';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'dark' | 'outline';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  iconName?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'sm' | 'md' | 'lg';
}

export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  iconName,
  iconPosition = 'right',
  loading = false,
  disabled = false,
  style,
  textStyle,
  size = 'md',
}: CustomButtonProps) {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return colors.primary; // Neon Green #D4FF32
      case 'secondary':
        return colors.secondary; // Electric Blue #3B38F6
      case 'accent':
        return colors.accent; // Vibrant Orange #FF7A00
      case 'dark':
        return colors.surfaceDark; // #262626
      case 'outline':
        return '#FFFFFF';
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'secondary':
      case 'dark':
      case 'accent':
        return '#FFFFFF';
      case 'primary':
      case 'outline':
      default:
        return colors.textDark; // #111827
    }
  };

  const isDarkBg = variant === 'secondary' || variant === 'dark' || variant === 'accent';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.buttonBase,
        {
          backgroundColor: getBackgroundColor(),
          paddingVertical: size === 'sm' ? 8 : size === 'lg' ? 16 : 12,
          paddingHorizontal: size === 'sm' ? 14 : size === 'lg' ? 24 : 18,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {iconName && iconPosition === 'left' && (
            <Icon
              name={iconName}
              size={size === 'sm' ? 16 : 20}
              color={getTextColor()}
              style={{ marginRight: 8 }}
            />
          )}
          <Text
            style={[
              styles.textBase,
              {
                color: getTextColor(),
                fontSize: size === 'sm' ? 12 : size === 'lg' ? 15 : 13,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {iconName && iconPosition === 'right' && (
            <Icon
              name={iconName}
              size={size === 'sm' ? 16 : 20}
              color={getTextColor()}
              style={{ marginLeft: 8 }}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    borderWidth: 2.5,
    borderColor: '#111827',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    // Solid Neo-Brutalism Shadow
    shadowColor: '#111827',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBase: {
    fontWeight: '900',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

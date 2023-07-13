import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Icon from './Icon';

import colors from '../config/colors';

export interface AppButtonProps {
  title?: string;
  onPress?: () => void;
  fontWeight?: string;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  icon?: string;
  iconColor?: string;
  iconSize?: number;
  style?: any;
  disabled?: boolean;
}

function AppButton({
  title,
  onPress,
  fontWeight = 'normal',
  fontSize = 16,
  color = 'dark',
  backgroundColor = 'light',
  icon,
  iconColor = 'dark',
  iconSize = 20,
  style,
  disabled,
}: AppButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={[
        styles.button,
        {
          backgroundColor: colors[backgroundColor],
          borderColor: colors[color],
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      onPress={disabled ? undefined : onPress}>
      {icon && (
        <Icon
          name={icon as any}
          size={iconSize}
          iconColor={colors[iconColor]}
          style={styles.icon}
        />
      )}
      {title && (
        <Text
          style={{
            color: colors[color],
            fontWeight: fontWeight,
            fontSize: fontSize,
          }}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: '100%',
    marginVertical: 10,
  },
  icon: {
    paddingLeft: 6,
  },
});

export default AppButton;

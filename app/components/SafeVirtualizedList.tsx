import React from 'react';
import { FlatList, FlatListProps, SectionList, SectionListProps, StyleSheet, View, ViewStyle } from 'react-native';

interface SafeFlatListProps<T> extends Omit<FlatListProps<T>, 'scrollEnabled'> {
  style?: ViewStyle;
  containerStyle?: ViewStyle;
}

interface SafeSectionListProps<T, S> extends Omit<SectionListProps<T, S>, 'scrollEnabled'> {
  style?: ViewStyle;
  containerStyle?: ViewStyle;
}

/**
 * Un componente FlatList seguro para usar dentro de ScrollViews
 * Deshabilita el scroll de la FlatList y lo envuelve en un contenedor
 */
export const SafeFlatList = <T extends any>(props: SafeFlatListProps<T>): React.ReactElement => {
  const { style, containerStyle, ...restProps } = props;
  
  return (
    <View style={[styles.container, containerStyle]}>
      <FlatList
        {...restProps}
        scrollEnabled={false}
        style={[styles.list, style]}
        nestedScrollEnabled={true}
      />
    </View>
  );
};

/**
 * Un componente SectionList seguro para usar dentro de ScrollViews
 * Deshabilita el scroll del SectionList y lo envuelve en un contenedor
 */
export const SafeSectionList = <T extends any, S extends any>(props: SafeSectionListProps<T, S>): React.ReactElement => {
  const { style, containerStyle, ...restProps } = props;
  
  return (
    <View style={[styles.container, containerStyle]}>
      <SectionList
        {...restProps}
        scrollEnabled={false}
        style={[styles.list, style]}
        nestedScrollEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  list: {
    width: '100%',
  },
}); 
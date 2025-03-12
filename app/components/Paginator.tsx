// app/components/Paginator.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';

interface PaginatorProps {
  pages: number;
  currentPage: number;
}

const Paginator: React.FC<PaginatorProps> = ({ pages, currentPage }) => {
  const dots = Array.from({ length: pages }, (_, index) => (
    <View
      key={index}
      style={[
        styles.dot,
        index === currentPage ? styles.activeDot : styles.inactiveDot,
      ]}
    />
  ));

  return <View style={styles.container}>{dots}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#007AFF',
  },
  inactiveDot: {
    backgroundColor: '#ccc',
  },
});

export default Paginator;
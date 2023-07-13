import React, {useEffect, useMemo} from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {getData, onFilter} from '../features/itemsData/itemsDataSlice';
import Activityindicator from '../components/Activityindicator';
import Text from '../components/Text';
import Icon from '../components/Icon';
import colors from '../config/colors';
import Screen from '../components/Screen';
import Button from '../components/Button';
import Sounds from '../components/Sounds';

const SelectItemScreen = () => {
  const {filteredData, filters, isLoading, error} = useSelector(
    (store: any) => store.items,
  );
  const dispatch: any = useDispatch();
  const getInitialData = async () => await dispatch(getData(filters));

  useEffect(() => {
    getInitialData();
  }, []);

  useMemo(() => {
    if (filteredData.length === 1) {
      Sounds.itemSelected.play();
    }
  }, [filteredData]);

  return (
    <Screen>
      <Activityindicator visible={isLoading} />
      <View style={styles.selectedItemContainer}>
        <View
          style={[
            styles.selectedItem,
            {
              borderColor:
                filteredData.length === 1 ? colors.primary : colors.dark,
            },
          ]}>
          <Icon
            size={50}
            name={filteredData.length === 1 ? 'check-decagram' : 'tag-off'}
            iconColor={
              filteredData.length === 1 ? colors.secondary : colors.dark
            }
          />
          <Text style={styles.itemTitle}>
            {filteredData.length === 1
              ? filteredData[0].fullName
              : `Item is not selected`}
          </Text>
        </View>
      </View>
      <View style={styles.filtersContainer}>
        {filters.brands?.list && (
          <View style={styles.filterWrap}>
            <Text style={styles.title}>Brands:</Text>
            <FlatList
              data={filters.brands.list}
              renderItem={({item}) => (
                <Button
                  onPress={() =>
                    dispatch(onFilter({type: 'brands', id: item.id}))
                  }
                  style={styles.btnTags}
                  title={item.name}
                  color={
                    filters.brands.selected.includes(item.id)
                      ? 'primary'
                      : 'dark'
                  }
                  disabled={filters.brands.disabled.includes(item.id)}
                />
              )}
              keyExtractor={item => item.id}
              horizontal
            />
          </View>
        )}
        {filters.qualities.list && (
          <View style={styles.filterWrap}>
            <Text style={styles.title}>Qualities:</Text>
            <FlatList
              data={filters.qualities?.list}
              renderItem={({item}) => (
                <Button
                  onPress={() =>
                    dispatch(onFilter({type: 'qualities', id: item.id}))
                  }
                  style={styles.btnTags}
                  title={item.name}
                  color={
                    filters.qualities.selected.includes(item.id)
                      ? 'primary'
                      : 'dark'
                  }
                  disabled={filters.qualities.disabled.includes(item.id)}
                />
              )}
              keyExtractor={item => item.id}
              horizontal
            />
          </View>
        )}
        {filters.sizes.list && (
          <View style={styles.filterWrap}>
            <Text style={styles.title}>Sizes:</Text>
            <FlatList
              data={filters.sizes.list}
              renderItem={({item}) => (
                <Button
                  onPress={() =>
                    dispatch(onFilter({type: 'sizes', id: item.id}))
                  }
                  style={styles.btnTags}
                  title={item.name}
                  color={
                    filters.sizes.selected.includes(item.id)
                      ? 'primary'
                      : 'dark'
                  }
                  disabled={filters.sizes.disabled.includes(item.id)}
                />
              )}
              keyExtractor={item => item.id}
              horizontal
            />
          </View>
        )}
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    </Screen>
  );
};

export default SelectItemScreen;

const styles = StyleSheet.create({
  selectedItemContainer: {
    flex: 0.3,
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedItem: {
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 20,
    marginTop: 10,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  error: {
    color: colors.error,
    width: '100%',
    textAlign: 'center',
  },
  filtersContainer: {
    flex: 0.7,
    backgroundColor: colors.light,
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  filterWrap: {
    width: '100%',
    marginBottom: 20,
  },
  btnTags: {
    width: 'auto',
    marginEnd: 5,
  },
  title: {
    fontSize: 20,
  },
});

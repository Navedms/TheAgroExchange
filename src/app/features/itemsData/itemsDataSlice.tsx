import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import itemsApi, {Item} from '../../api/itemsApi';

type FilterTypes = 'brands' | 'qualities' | 'sizes';

type Filters<K extends string> = {
  [key in K]: {
    list: number[];
    selected: number[];
    disabled: number[];
  };
};

interface List {
  id?: number;
  name?: string;
}

export interface InitialState {
  isLoading: boolean;
  data: Item[];
  filteredData: Item[];
  filters: Filters<FilterTypes>;
  error?: string;
}

const initialState: InitialState = {
  isLoading: false,
  error: undefined,
  data: [],
  filteredData: [],
  filters: {
    brands: {
      list: [],
      selected: [],
      disabled: [],
    },
    qualities: {
      list: [],
      selected: [],
      disabled: [],
    },
    sizes: {
      list: [],
      selected: [],
      disabled: [],
    },
  },
};

export const getData = createAsyncThunk(
  'items/getData',
  async (filters: Filters<FilterTypes>, thunkAPI) => {
    const response = await itemsApi.get();
    return response.data;
  },
);

const dataSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    onFilter: (state, {payload}) => {
      state.isLoading = true;
      // 1. handle selected values
      if (
        state.filters[payload.type as FilterTypes].selected.includes(payload.id)
      ) {
        const newFilterSelected = state.filters[
          payload.type as FilterTypes
        ].selected.filter(item => item !== payload.id);
        state.filters[payload.type as FilterTypes].selected = newFilterSelected;
      } else {
        state.filters[payload.type as FilterTypes].selected = [
          ...state.filters[payload.type as FilterTypes].selected,
          payload.id,
        ];
      }
      // 2. update the filteredData list by filters.
      if (
        (!state.filters.brands.selected.length &&
          !state.filters.qualities.selected.length &&
          !state.filters.sizes.selected.length) ||
        !state.data.length
      ) {
        state.filteredData = [];
      } else {
        state.filteredData = state.data.filter(
          item =>
            (state.filters.brands.selected.includes(item.brandId) ||
              !state.filters.brands.selected.length) &&
            ((item.qualityId &&
              state.filters.qualities.selected.includes(item.qualityId)) ||
              !state.filters.qualities.selected.length) &&
            ((item.sizeId &&
              state.filters.sizes.selected.includes(item.sizeId)) ||
              !state.filters.sizes.selected.length),
        );
      }
      // 3. handle disabled values

      // set the other lists before you start...
      const firstFilterType =
        payload.type === 'brands'
          ? 'qualities'
          : payload.type === 'qualities'
          ? 'sizes'
          : 'brands';
      const firstFilterTypeId =
        payload.type === 'brands'
          ? 'qualityId'
          : payload.type === 'qualities'
          ? 'sizeId'
          : 'brandId';

      const secondFilterType =
        payload.type === 'brands'
          ? 'sizes'
          : payload.type === 'qualities'
          ? 'brands'
          : 'qualities';
      const secondFilterTypeId =
        payload.type === 'brands'
          ? 'sizeId'
          : payload.type === 'qualities'
          ? 'brandId'
          : 'qualityId';

      // 1. firstFilterType
      // make arry of the [firstFilterType] that active in the new filtered list (like before: remove duplicate ids).
      const includeFirstFilterType = state.filteredData
        .filter(
          (obj: Item, index: number) =>
            state.filteredData.findIndex(
              (item: Item) =>
                item[firstFilterTypeId] &&
                item[firstFilterTypeId] === obj[firstFilterTypeId],
            ) === index,
        )
        .map((item: Item) => item[firstFilterTypeId]);

      // take the full [firstFilterType] list, remove from it the active [firstFilterType].
      const disabledFirstFilterType = state.filters[firstFilterType].list
        .filter(
          (item: any) =>
            includeFirstFilterType.length > 0 &&
            !includeFirstFilterType.includes(item.id),
        )
        .map((item: any) => item.id);
      state.filters[firstFilterType].disabled = disabledFirstFilterType;

      // 2. secondFilterType
      // make arry of the [secondFilterType] that active in the new filtered list (like before: remove duplicate ids).
      const includeSecondFilterType = state.filteredData
        .filter(
          (obj: Item, index: number) =>
            state.filteredData.findIndex(
              (item: Item) =>
                item[secondFilterTypeId] &&
                item[secondFilterTypeId] === obj[secondFilterTypeId],
            ) === index,
        )
        .map((item: Item) => item[secondFilterTypeId]);

      // take the full [secondFilterType] list, remove from it the active [secondFilterType].
      const disabledSecondFilterType = state.filters[secondFilterType].list
        .filter(
          (item: any) =>
            includeSecondFilterType.length > 0 &&
            !includeSecondFilterType.includes(item.id),
        )
        .map((item: any) => item.id);
      state.filters[secondFilterType].disabled = disabledSecondFilterType;

      // 3. if only one category selected after the filter, make this category enabled again.
      if (
        !state.filters.qualities.selected.length &&
        !state.filters.sizes.selected.length
      ) {
        state.filters.brands.disabled = [];
      } else if (
        !state.filters.brands.selected.length &&
        !state.filters.sizes.selected.length
      ) {
        state.filters.qualities.disabled = [];
      } else if (
        !state.filters.qualities.selected.length &&
        !state.filters.brands.selected.length
      ) {
        state.filters.sizes.disabled = [];
      }
      state.isLoading = false;
    },
  },
  extraReducers: builder => {
    builder.addCase(getData.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      // make arry of the brands. filter null and duplicate brands ids.
      state.filters.brands.list = action.payload
        .filter(
          (obj: Item, index: number) =>
            action.payload.findIndex(
              (item: Item) => item.brandId && item.brandId === obj.brandId,
            ) === index,
        )
        .map((item: Item) => {
          return {id: item.brandId, name: item.brandName};
        });
      // make arry of the qualities. filter null and duplicate qualities ids.
      state.filters.qualities.list = action.payload
        .filter(
          (obj: Item, index: number) =>
            action.payload.findIndex(
              (item: Item) =>
                item.qualityId && item.qualityId === obj.qualityId,
            ) === index,
        )
        .map((item: Item) => {
          return {id: item.qualityId, name: item.qualityName};
        });
      // make arry of the sizes. filter null and duplicate sizes ids.
      state.filters.sizes.list = action.payload
        .filter(
          (obj: Item, index: number) =>
            action.payload.findIndex(
              (item: Item) => item.sizeId && item.sizeId === obj.sizeId,
            ) === index,
        )
        .map((item: Item) => {
          return {id: item.sizeId, name: item.sizeName};
        });
    });
    builder.addCase(getData.rejected, (state, action) => {
      state.error = 'Unable to patch data. Try again later.';
      state.isLoading = false;
    });
  },
});

export const {onFilter} = dataSlice.actions;

export default dataSlice.reducer;

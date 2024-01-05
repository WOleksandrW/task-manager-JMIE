import React, { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import api from '../../../../api';
import { List } from '../../../../components';
import { MarkedItem } from '../';
import { DetailsNotedType } from '../../../../types/user/notedItemUserType';

function MarkedItemsList() {
  const notedItemList = useSelector((state: RootState) => state.userSlice.noted);

  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState<DetailsNotedType[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await api.noted.getDetails({ list: notedItemList });
        setList(response.data);
      } catch (error) {
        setError(`${(error as AxiosError).response?.data ?? 'error'}`);
      }
      setIsLoading(false);
    })();
  }, [notedItemList]);

  return (
    <List
      isLoading={isLoading}
      count={notedItemList.length}
      textLoader="Loading noted items..."
      textEmpty="There are no marked items"
      errorMessage={error}>
      {list.map((item) => (
        <MarkedItem key={`noted-${item.id}`} {...item} />
      ))}
    </List>
  );
}

export default MarkedItemsList;

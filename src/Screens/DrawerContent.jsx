import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import React from 'react';

const DrawerContent = () => {
  return (
    <div>
      <DrawerContentScrollView>
        <DrawerItemList />
        <DrawerItem
          label="Help"
          onPress={() => Linking.openURL('https://mywebsite.com/help')}
        />
      </DrawerContentScrollView>
    </div>
  );
};

export default DrawerContent;

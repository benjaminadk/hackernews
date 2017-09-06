import DataLoader from 'dataloader';

const batchUsers = async (Users, keys) => {
  return await Users.find({_id: {$in: keys}}).toArray();
}

const buildDataLoaders = ({Users}) => ({

  userLoader: new DataLoader(
      keys => batchUsers(Users, keys),
      {cacheKeyFn: key => key.toString()}
      )
});

export default buildDataLoaders ;
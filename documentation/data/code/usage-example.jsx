import PropertyList from '@material-appkit/core/components/PropertyList';

function UserInfoList({ user }) {
  return (
    <PropertyList
      arrangement={[
        { name: 'username' },
        { name: 'email' },
        { name: 'phone' },
      ]}
      representedObject={user}
    />
  )
}
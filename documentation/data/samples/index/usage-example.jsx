import PropertyList from '@material-appkit/core/components/PropertyList';
import PhoneIcon from '@material-ui/icons/Phone';

function UserInfoList({ user }) {
  return (
    <PropertyList
      arrangement={[
        { name: 'username' },
        { keyPath: 'address.city', label: 'City', },
        { name: 'phone', Icon: PhoneIcon },
      ]}
      representedObject={user}
    />
  )
}
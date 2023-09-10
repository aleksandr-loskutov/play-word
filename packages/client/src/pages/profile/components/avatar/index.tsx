import { ChangeEvent, FC } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import SkeletonImage from 'antd/lib/skeleton/Image';
import createCn from '../../../../utils/create-cn';
import { User } from '../../../../types/user';
import { Nullable } from '../../../../types/common';
import './style.css';

type ProfileAvatarImageProps = {
  avatar?: string;
};

type ProfileAvatarProps = {
  className?: string;
  user: Nullable<User>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void; // Specify input type
};

const cn = createCn('profile-avatar');

const Image: FC<ProfileAvatarImageProps> = ({ avatar }) =>
  avatar ? (
    <img className={cn('image')} src={avatar} alt="avatar" />
  ) : (
    <SkeletonImage className={cn('image-placeholder')} />
  );

const ProfileAvatar: FC<ProfileAvatarProps> = ({
  user,
  onChange,
  className,
}) => (
  <form className={`${className || ''} ${cn('container')}`}>
    <label htmlFor="profile-avatar">
      <Image avatar={user?.avatar} />

      <input
        onChange={onChange}
        type="file"
        name="avatar"
        id="profile-avatar"
        className={cn('input')}
      />

      <div className={cn('upload-button')}>
        <UploadOutlined />
      </div>
    </label>
  </form>
);

export default ProfileAvatar;

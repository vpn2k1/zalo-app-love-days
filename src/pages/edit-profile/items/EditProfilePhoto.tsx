import { useState, type CSSProperties, type KeyboardEvent } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { AppCameraCapture } from "@/components/forms/AppCameraCapture";
import { AppImagePickerSheet } from "@/components/forms/AppImagePickerSheet";
import { AppImageViewer, AppSheet, Box, Icon } from "@/components/zaui";
import { pickImagePath, type ImageSourceType } from "@/utils/imagePicker";

import type { ProfileFormValues } from "../types/EditProfilePageType";

export function EditProfilePhoto() {
  const { control, setValue } = useFormContext<ProfileFormValues>();
  const avatarUrl = useWatch({
    control,
    name: "custom_avatar_url",
    exact: true,
  });
  const avatarSrc = getAvatarSrc(avatarUrl);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);

  const updateAvatar = (imageUrl: string) => {
    setValue("custom_avatar_url", imageUrl, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const closeSheet = () => {
    setSheetVisible(false);
  };

  const openSheet = () => {
    setSheetVisible(true);
  };

  const openViewer = () => {
    if (!avatarSrc) return;

    setViewerVisible(true);
  };

  const closeViewer = () => {
    setViewerVisible(false);
  };

  const pickImage = async (sourceType: ImageSourceType) => {
    setSheetVisible(false);
    await waitForSheetDismiss();
    try {
      const image = await pickImagePath(sourceType);
      if (!image) return;

      updateAvatar(image);
    } catch (pickerError) {
      console.error(pickerError);
    }
  };

  const openCamera = async () => {
    setSheetVisible(false);
    await waitForSheetDismiss();
    setCameraVisible(true);
  };

  const closeCamera = () => {
    setCameraVisible(false);
  };

  const pickAlbumFromCamera = () => {
    return pickImagePath("album");
  };

  const captureImage = (imageUrl: string) => {
    updateAvatar(imageUrl);
    closeCamera();
  };

  return (
    <>
      <Box className="app-profile-photo">
        <ProfilePhotoAvatar avatarSrc={avatarSrc} onOpenViewer={openViewer} />
        <Box
          className="app-profile-photo-action"
          aria-label="Thay ảnh"
          role="button"
          tabIndex={0}
          onClick={openSheet}
          onKeyDown={(event) => runKeyboardAction(event, openSheet)}
        >
          <Icon icon="zi-camera" /> Thay ảnh
        </Box>
      </Box>
      {avatarSrc && (
        <AppImageViewer
          images={[avatarSrc]}
          visible={viewerVisible}
          onClose={closeViewer}
        />
      )}
      <AppSheet
        className="app-image-picker-sheet-host"
        autoHeight
        visible={sheetVisible}
        unmountOnClose={false}
        onClose={closeSheet}
      >
        <AppImagePickerSheet
          onClose={closeSheet}
          onPickAlbum={() => pickImage("album")}
          onOpenCamera={openCamera}
        />
      </AppSheet>
      <AppCameraCapture
        visible={cameraVisible}
        onCapture={captureImage}
        onClose={closeCamera}
        onPickAlbum={pickAlbumFromCamera}
      />
    </>
  );
}

function ProfilePhotoAvatar({
  avatarSrc,
  onOpenViewer,
}: {
  avatarSrc?: string;
  onOpenViewer: () => void;
}) {
  if (!avatarSrc) return <Box className="app-profile-photo-avatar" />;

  const avatarStyle: CSSProperties = {
    backgroundImage: `url("${avatarSrc}")`,
  };
  return (
    <Box
      aria-label="Xem ảnh đại diện"
      className="app-profile-photo-avatar app-profile-photo-avatar-filled"
      role="button"
      style={avatarStyle}
      tabIndex={0}
      onClick={onOpenViewer}
      onKeyDown={(event) => runKeyboardAction(event, onOpenViewer)}
    />
  );
}

function getAvatarSrc(avatarUrl: string) {
  if (!avatarUrl) return undefined;

  return avatarUrl;
}

function waitForSheetDismiss() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 180);
  });
}

function runKeyboardAction(
  event: KeyboardEvent<HTMLElement>,
  action: () => void,
) {
  if (event.key !== "Enter" && event.key !== " ") return;

  event.preventDefault();
  action();
}

import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';

import { theme, mixins } from '../../styles';
import { RootState } from '../../store';
import { DidState } from '../../store/slices/did';
import { deleteCredential } from '../../store/slices/wallet';
import { sharePresentation } from '../../lib/present';
import { MenuItem, NavHeader, ConfirmModal } from '../../components';

import type { CredentialScreenProps } from './CredentialScreen.d';
import styles from './CredentialScreen.styles';

export default function CredentialScreen({ navigation, route }: CredentialScreenProps): JSX.Element {
  const dispatch = useDispatch();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { rawCredentialRecord, noShishKabob = false } = route.params;
  const { rawDidRecords } = useSelector<RootState, DidState>(({ did }) => did);
  const { credential } = rawCredentialRecord;

  const title = credential.credentialSubject.hasCredential?.name ?? '';
  const description = credential.credentialSubject.hasCredential?.description ?? '';
  const issuer =
    typeof credential.issuer !== 'string' && credential.issuer.name !== undefined
      ? credential.issuer.name
      : '';
  const issuanceDate = moment(credential.issuanceDate).format('MMM D, YYYY');
  const subjectName = credential.credentialSubject.name;
  const numberOfCredits = credential.credentialSubject.hasCredential?.awardedOnCompletionOf?.numberOfCredits?.value ?? '';
  const startDate = credential.credentialSubject.hasCredential?.awardedOnCompletionOf?.startDate ?? '';
  const endDate = credential.credentialSubject.hasCredential?.awardedOnCompletionOf?.endDate ?? '';

  const image = null; // TODO: Decide where to pull image from.
  const verified = true; // TODO: Add logic for verifying credential.

  function share() {
    if (rawDidRecords.length === 0) {
      throw new Error('No DID generated. Something went wrong in wallet initialization.');
    }

    const [ rawDidRecord ] = rawDidRecords;

    sharePresentation([rawCredentialRecord], rawDidRecord);
  }

  function HeaderRightComponent(): JSX.Element | null {
    if (noShishKabob) {
      return null;
    }

    return (
      <>
        <MaterialIcons
          name="more-vert"
          style={mixins.headerIcon}
          onPress={() => setMenuIsOpen(!menuIsOpen)}
        />
        {menuIsOpen ? (
          <View style={styles.menuContainer}>
            <MenuItem icon="share" title="Share" onPress={share} />
            <MenuItem icon="bug-report" title="Debug" onPress={() => null} />
            <MenuItem icon="delete" title="Delete" onPress={() => {
              setMenuIsOpen(false);
              setModalIsOpen(true);
            }}/>
          </View>
        ) : null}
      </>
    );
  }

  return (
    <>
      <NavHeader
        title="Credential Preview"
        goBack={() => navigation.goBack()}
        rightComponent={<HeaderRightComponent />}
      />
      <ConfirmModal
        open={modalIsOpen}
        onRequestClose={() => setModalIsOpen(!modalIsOpen)}
        onConfirm={() => {
          dispatch(deleteCredential(rawCredentialRecord));
          navigation.goBack();
        }}
        title="Delete Credential"
        confirmText="Delete"
      >
        <Text style={styles.modalBodyText}>
          Are you sure you want to remove {'\n'}
          {title} {'\n'}
          from your wallet?
        </Text>
      </ConfirmModal>
      <ScrollView onScrollEndDrag={() => setMenuIsOpen(false)}>
        <TouchableWithoutFeedback onPress={() => setMenuIsOpen(false)}>
          <View style={styles.container}>
            <Text style={styles.header}>{title}</Text>
            <Text style={styles.paragraph}>{description}</Text>
            <View style={styles.credentialContainer}>
              <View style={styles.dataContainer}>
                <Text style={styles.dataLabel}>Issuer</Text>
                <View style={styles.flexRow}>
                  {image ? (
                    <Image source={image} style={styles.dataImage} />
                  ) : (
                    <View style={styles.dataImage}>
                      <MaterialCommunityIcons
                        name="certificate"
                        size={styles.dataImage.width}
                        color={theme.color.iconActive}
                      />
                    </View>
                  )}
                  <Text style={styles.dataValue}>{issuer}</Text>
                </View>
              </View>
              <View style={styles.dataContainer}>
                <Text style={styles.dataLabel}>Issuance Date</Text>
                <Text style={styles.dataValue}>{issuanceDate}</Text>
              </View>
              <View style={styles.dataContainer}>
                <Text style={styles.dataLabel}>Subject Name</Text>
                <Text style={styles.dataValue}>{subjectName}</Text>
              </View>
              {numberOfCredits ? (
                <View style={styles.dataContainer}>
                  <Text style={styles.dataLabel}>Number of Credits</Text>
                  <Text style={styles.dataValue}>{numberOfCredits}</Text>
                </View>
              ) : null}
              <View style={styles.flexRow}>
                {startDate ? (
                  <View style={styles.dataContainer}>
                    <Text style={styles.dataLabel}>Start Date</Text>
                    <Text style={styles.dataValue}>{startDate}</Text>
                  </View>
                ) : null}
                {endDate ? (
                  <View style={styles.dataContainer}>
                    <Text style={styles.dataLabel}>End Date</Text>
                    <Text style={styles.dataValue}>{endDate}</Text>
                  </View>
                ) : null}
              </View>
            </View>
            {verified ? (
              <View style={[styles.flexRow, styles.proofContainer]}>
                <MaterialIcons
                  name="check-circle"
                  size={theme.iconSize}
                  color={theme.color.success}
                />
                <Text style={[styles.dataValue, styles.proofText]}>
                Credential Verified
                </Text>
              </View>
            ) : (
              <View style={[styles.flexRow, styles.proofContainer]}>
                <MaterialCommunityIcons
                  name="close-circle"
                  size={theme.iconSize}
                  color={theme.color.error}
                />
                <Text style={[styles.dataValue, styles.proofText]}>
                Invalid Credential
                </Text>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </>
  );
}

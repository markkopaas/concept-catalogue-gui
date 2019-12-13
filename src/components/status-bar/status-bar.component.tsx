import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import cx from 'classnames';
import _ from 'lodash';
import { Button } from 'reactstrap';
import { DateTime } from 'luxon';

import { localization } from '../../lib/localization';
import { useDispatch, useGlobalState } from '../../app/context/stateContext';
import { deleteConcept } from '../../api/concept-catalogue-api';
import { ButtonStrip } from '../button-strip/button-strip.component';

import './status-bar.scss';

const CONCEPT_STATUS_PUBLISHED = 'publisert';
const CONCEPT_STATUS_DRAFT = 'utkast';

interface ErrorOverlayProps {
  error?: object;
}

const renderErrorOverlay = ({ error }: ErrorOverlayProps): JSX.Element => (
  <div className="form-status-bar-overlay d-flex align-items-center justify-content-between alert-warning">
    {`${localization.errorSaving} - ${error}`}
  </div>
);

interface ConfirmDeleteOverlayProps {
  deleteConceptAndNavigate: Function;
  toggleShowConfirmDelete: Function;
}

const renderConfirmDeleteOverlayDialog = ({
  deleteConceptAndNavigate,
  toggleShowConfirmDelete
}: ConfirmDeleteOverlayProps): JSX.Element => (
  <div className="form-status-bar-overlay d-flex align-items-center justify-content-between alert-danger">
    <div>
      <span>{localization.confirmDeleteMessage}</span>
    </div>
    <div>
      <Button className="fdk-button mr-3" color="primary" onClick={deleteConceptAndNavigate}>
        {localization.confirmDelete}
      </Button>
      <button
        type="button"
        className="btn bg-transparent fdk-color-link-dark"
        onClick={() => toggleShowConfirmDelete()}
      >
        {localization.cancelDelete}
      </button>
    </div>
  </div>
);

interface Props {
  concept: object;
  isInitialInValidForm: boolean;
}

type EnhancedProps = Props & RouteComponentProps;

const lastSavedTime = (endringstidspunkt): string => {
  return (
    endringstidspunkt &&
    DateTime.fromISO(endringstidspunkt, { locale: localization.getLanguage() }).toFormat(localization.timeStampPattern)
  );
};

export const StatusBarPure = ({ concept, isInitialInValidForm, history, match: { params } }: EnhancedProps) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const toggleShowConfirmDelete = (): void => setShowConfirmDelete(!showConfirmDelete);

  const catalogId = _.get(params, 'catalogId');
  const conceptId = _.get(concept, 'id');
  const published = _.get(concept, 'status') === CONCEPT_STATUS_PUBLISHED;

  const stateConcept = useGlobalState(conceptId);
  const dispatch = useDispatch();

  const status = _.get(stateConcept, 'status');
  const justPublishedOrUnPublished = _.get(stateConcept, 'justPublishedOrUnPublished');
  const isSaving = _.get(stateConcept, 'isSaving', false);
  const error = _.get(stateConcept, 'error');
  const validationError = _.get(stateConcept, 'validationError', isInitialInValidForm);
  const endringstidspunkt = _.get(stateConcept, 'endringstidspunkt');

  let messageClass;
  let message;

  if (justPublishedOrUnPublished) {
    messageClass = 'alert-success';
    message = status === CONCEPT_STATUS_PUBLISHED ? localization.conceptPublished : localization.conceptUnPublished;
  } else {
    messageClass = 'alert-primary';
    if (isSaving) {
      message = `${localization.isSaving}...`;
    } else if (published || status === CONCEPT_STATUS_PUBLISHED) {
      message = `${localization.changesUpdated} ${lastSavedTime(
        endringstidspunkt || _.get(concept, ['endringslogelement', 'endringstidspunkt'])
      )}.`;
    } else {
      message = `${localization.savedAsDraft} ${lastSavedTime(
        endringstidspunkt || _.get(concept, ['endringslogelement', 'endringstidspunkt'])
      )}.`;
    }
  }

  const deleteConceptAndNavigate = async (): Promise<void> => {
    await deleteConcept(conceptId);
    history && history.push(`/${catalogId}`);
  };

  return (
    <>
      {error && renderErrorOverlay({ error })}
      {showConfirmDelete &&
        renderConfirmDeleteOverlayDialog({
          deleteConceptAndNavigate,
          toggleShowConfirmDelete
        })}
      <div
        className={cx(
          'form-status-bar',
          'd-flex',
          'align-items-center',
          'justify-content-between',
          'fadeFromBottom-500',
          messageClass
        )}
      >
        <div>{message}</div>
        <div className="d-flex">
          <ButtonStrip concept={{}} />
          <button
            type="button"
            className="btn bg-transparent fdk-color-link-dark"
            disabled={false}
            onClick={toggleShowConfirmDelete}
          >
            Slett
          </button>
        </div>
      </div>
    </>
  );
};

export const StatusBar = withRouter(StatusBarPure);

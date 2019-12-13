import React from 'react';
import { Button } from 'reactstrap';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { ReactComponent as IconApproved } from '../../assets/img/icon-approved-sm.svg';
import { ReactComponent as IconDraft } from '../../assets/img/icon-draft-sm.svg';
import { ReactComponent as IconPublished } from '../../assets/img/icon-published-sm.svg';
import { patchConceptFromForm } from '../../lib/patchConceptForm';
import { useDispatch } from '../../app/context/stateContext';

import './button-strip.scss';

const CONCEPT_STATUS_PUBLISHED = 'publisert';
const CONCEPT_STATUS_DRAFT = 'utkast';

interface Props {
  concept: object;
}

type EnhancedProps = Props & RouteComponentProps;

export const ButtonStripPure = ({ concept }: EnhancedProps): JSX.Element => {
  const dispatch = useDispatch();
  return (
    <div>
      <Button
        id="dataset-setDraft-button"
        className="fdk-button fdk-strip-button mr-3"
        color="secondary"
        disabled={false}
        onClick={() => patchConceptFromForm({ status: CONCEPT_STATUS_DRAFT }, { concept, dispatch })}
      >
        <IconDraft />
        Utkast
      </Button>
      <Button
        id="dataset-setApprove-button"
        className="fdk-button fdk-strip-button mr-3"
        color="primary"
        disabled={false}
        onClick={() => patchConceptFromForm({ status: CONCEPT_STATUS_PUBLISHED }, { concept, dispatch })} // should be STATUS_APPROVED
      >
        <IconApproved />
        Godkjent
      </Button>
      <Button
        id="dataset-setPublish-button"
        className="fdk-button fdk-strip-button mr-3"
        color="primary"
        disabled={false}
        onClick={() => patchConceptFromForm({ status: CONCEPT_STATUS_PUBLISHED }, { concept, dispatch })}
      >
        <IconPublished />
        Publisert
      </Button>
    </div>
  );
};

export const ButtonStrip = withRouter(ButtonStripPure);

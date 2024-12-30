import { Button, Flex } from '@radix-ui/themes';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import { getCurrentTeam } from '../../state/selectors/teams';
import { Method, sendRequest } from '../../clients/api';
import { useCallback } from 'react';

const TriggerAdHocButton = ({ url, uuid }: { url: string; uuid: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTeam = useSelector(getCurrentTeam)!;

  /**
   * Handle form submission
   */
  const handleClick = useCallback(() => {
    /**
     * Send request to trigger pulse
     */
    sendRequest(Method.POST, 'pulses', { url, teamId: currentTeam?.id }).then(() => {
      /**
       * Redirect to pulses page after triggering pulse
       */
      if (location.pathname !== `/urls/${uuid}`) {
        navigate(`/urls/${uuid}`);
      } else {
        //TODO: refresh table
      }
    });
  }, [url, currentTeam, location, navigate, uuid]);

  return currentTeam && (
    <Flex gap='3' align='center' className='px-4 py-2 my-4'>
      <Button onClick={handleClick}>Trigger Pulse</Button>
    </Flex>
  );
};

export { TriggerAdHocButton };
import { connect } from 'react-redux';
import Greeting from './greeting';
import { logout } from '../../actions/session_actions';
import { updatePhoto } from '../../actions/user_actions';

const mSTP = (state) => {
  return {
    currentUser: state.entities.users[state.session.id]
  }
};

const mDTP = (dispatch) => ({
  logout: () => dispatch(logout()),
  updatePhoto: (data, userId) => dispatch(updatePhoto(data, userId))
});

export default connect(mSTP, mDTP)(Greeting);
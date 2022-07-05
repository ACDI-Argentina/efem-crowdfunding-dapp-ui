import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const InputField = withStyles({
    root: {
        '& .MuiInput-root:before': {
            borderBottomWidth: '2px',
            borderBottomColor: '#7868E5'
        },
        '& .MuiInput-root:hover': {
            borderBottomColor: 'red'
        },
    },
})(TextField);

export default InputField; 
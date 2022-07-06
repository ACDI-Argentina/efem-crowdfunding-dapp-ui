import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const InputField = withStyles((theme) => {
    return {
        root: {
            '& .MuiInput-root:before': {
                borderBottomWidth: '2px',
                borderBottomColor: theme.palette.primary.main
            },
            '& .MuiInput-root:hover': {
                borderBottomColor: 'red'
            },
        }
    }

})(TextField);

export default InputField; 
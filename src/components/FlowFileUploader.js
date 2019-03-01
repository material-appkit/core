/**
*
* FlowFileUploader
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import Flow from 'docs.flowjs';

import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import RootRef from '@material-ui/core/RootRef';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const DEFAULT_CHUNK_SIZE = 1024 * 512; // 512Kb

class FlowFileUploader extends React.PureComponent {
  constructor(props) {
    super(props);

    this.flow = new Flow({
      chunkSize: props.chunkSize,
      headers: props.headers,
      maxChunkRetries: 0,
      simultaneousUploads: 1,
      singleFile: !props.multiple,
      target: props.uploadUrl,
      testChunks: false,
      query: props.query,
    });

    if (!this.flow.support) {
      throw new Error('Flow.js is not supported :/');
    }

    this.state = {
      progressPercentage: null,
      progressMode: null,
      status: '',
      previewImage: null,
      mediaImage: props.defaultImage,
    };

    this.browseButtonRef = React.createRef();

    if (props.variant === 'image') {
      this.previewImageMask = React.createRef();

      this.reader = new FileReader();
      this.reader.addEventListener("load", this.handleReaderLoad, false);

      this.loader = new Image();
      this.loader.addEventListener("load", this.handleImageLoad);
    }
  }

  componentDidMount() {
    this.flow.on('filesSubmitted', this.handleFileSubmit);
    this.flow.on('fileProgress', this.handleFileProgress);
    this.flow.on('fileSuccess', this.handleFileSuccess);
    this.flow.on('fileError', this.handleFileError);

    this.flow.assignBrowse(
      this.browseButtonRef.current,
      false,
      !this.props.multiple,
      this.props.attributes,
    );

    if (this.props.variant === 'image' && this.props.defaultSrc) {
      // If a default image was supplied, load it now
      this.setStatus('Loading...', undefined);
      this.loader.src = this.props.defaultSrc;
    }
  }

  componentWillUnmount() {
    this.flow.off();

    if (this.reader) {
      this.reader.removeEventListener("load", this.handleReaderLoad);
    }
    if (this.loader) {
      this.loader.removeEventListener("load", this.handleImageLoad);
    }
  }

  handleReaderLoad = (e) => {
    this.setState({ previewImage: e.target.result });
  };

  handleImageLoad = () => {
    // When a source image is loaded, update the state with its content,
    // clear any preview that might be present, and reset the progress indicator.
    this.setStatus('', null);
    this.setState({
      mediaImage: this.loader.src,
      previewImage: null,
    });
  };

  setStatus = (status, progress) => {
    let progressMode = null;
    if (progress === null) {
      progressMode = null;
    } else if (progress === undefined) {
      progressMode = 'indeterminate';
    } else {
      progressMode = 'determinate';
    }

    const progressPercentage = (progress || 0) * 100;

    this.setState({
      status,
      progressPercentage,
      progressMode,
    });

    if (this.props.variant === 'image') {
      const gradientStart = Math.round(progressPercentage);
      let gradientEnd = 0;

      if (progress !== null) {
        gradientEnd = gradientStart + 5;

        const previewImageMask = this.previewImageMask.current;
        if (this.previewImageMask.current) {
          const gradient = `-webkit-mask-image: linear-gradient(to right, black ${gradientStart}%, transparent ${gradientEnd}%);`;
          previewImageMask.setAttribute("style", gradient);
        }
      }
    }
  };

  //----------------------------------------------------------------------
  // Handler that's invoked when a file has been set via browse or drop
  handleFileSubmit = (files) => {
    if (files.length !== 1) {
      throw new Error("Expecting a single file");
    }
    const flowFile = files[0];

    this.setStatus(`${this.props.messages.PREPARING}...`, undefined);

    if (this.reader) {
      this.reader.readAsDataURL(flowFile.file);
    }

    // Begin the upload immediately
    flowFile.resume();
  };

  handleFileProgress = (file) => {
    this.setStatus(`${this.props.messages.UPLOADING}...`, file.progress());
  };

  handleFileSuccess = (file, message) => {
    this.setStatus(`${this.props.messages.UPLOAD_COMPLETE}`, null);

    this.flow.removeFile(file);

    if (this.props.onComplete) {
      this.props.onComplete(JSON.parse(message));
    }
  };

  handleFileError = async(file, message) => {
    if (!this.props.onError) {
      this.flow.removeFile(file);
      this.setStatus('Error', null);
    }

    const errorContext = await this.props.onError(message);
    if (errorContext.retry === true) {
      if (errorContext.headers) {
        this.flow.opts.headers = errorContext.headers;
      }
      file.retry();
    } else {
      this.flow.removeFile(file);
      this.setStatus('Error', null);
    }
  };

  render() {
    const {
      classes,
      UploadButtonIcon,
      uploadButtonTooltip,
      variant,
    } = this.props;

    const uploadButton = (
      <RootRef rootRef={this.browseButtonRef}>
        <Tooltip title={uploadButtonTooltip}>
          <IconButton className={classes.uploadButton}>
            <UploadButtonIcon />
          </IconButton>
        </Tooltip>
      </RootRef>
    );

    let progressBar = null;
    if (this.state.progressMode) {
      progressBar = (
        <LinearProgress
          className={classes.linearProgress}
          value={this.state.progressPercentage}
          variant={this.state.progressMode}
        />
      );
    }

    let content = null;
    if (variant === 'inline') {
      content = (
        <div className={classes.inlineContainer}>
          {uploadButton}
          {progressBar}
        </div>
      );
    } else if (variant === 'image') {
      content = (
        <Card>
          {!this.state.previewImage &&
            <CardMedia className={classes.cardMedia} image={this.state.mediaImage} />
          }

          <CardContent className={classes.cardContent}>
            {this.state.previewImage &&
              <div className={classes.previewImageContainer}>
                <img
                  alt="Preview"
                  className={classNames(classes.previewImage, classes.previewImageGreyscale)}
                  src={this.state.previewImage}
                />
                <img
                  alt="Preview Gradient Mask"
                  className={classNames(classes.previewImage, classes.previewImageMask)}
                  src={this.state.previewImage}
                  ref={this.previewImageMask}
                />
              </div>
            }
            {progressBar}
          </CardContent>
          <CardActions className={classes.cardActions} disableActionSpacing>
            {uploadButton}
            <Typography>{this.state.status}</Typography>
          </CardActions>
        </Card>
      );
    }

    return (
      <div className={classes.root}>
        {content}
      </div>
    )
  }
}

FlowFileUploader.propTypes = {
  attributes: PropTypes.object,
  chunkSize: PropTypes.number,
  classes: PropTypes.object.isRequired,
  defaultImage: PropTypes.any,
  defaultSrc: PropTypes.string,
  headers: PropTypes.object,
  messages: PropTypes.object,
  multiple: PropTypes.bool,
  onError: PropTypes.func,
  onComplete: PropTypes.func,
  query: PropTypes.object,
  uploadUrl: PropTypes.string.isRequired,
  uploadButtonTooltip: PropTypes.string,
  UploadButtonIcon: PropTypes.func,
  variant: PropTypes.oneOf(['inline', 'image']),
};

FlowFileUploader.defaultProps = {
  attributes: {},
  chunkSize: DEFAULT_CHUNK_SIZE,
  headers: {},
  messages: {
    PREPARING: 'Preparing',
    UPLOADING: 'Uploading',
    UPLOAD_COMPLETE: 'Upload Complete',
  },
  multiple: false,
  query: {},
  uploadButtonTooltip: 'Upload',
  UploadButtonIcon: CloudUploadIcon,
  variant: 'inline',
};

export default withStyles((theme) => ({
  // --------------------------------------------------------------------------
  root: {
    flexGrow: 1,
  },

  // Variant: any
  linearProgress: {
    flexGrow: 1,
  },

  uploadButton: {
    padding: 4,
  },

  // --------------------------------------------------------------------------
  // Variant: inline
  inlineContainer: {
    alignItems: 'center',
    display: 'flex',
  },

  // --------------------------------------------------------------------------
  // Variant: image
  previewImageContainer: {
    height: 250,
    borderRadius: 4,
    marginBottom: theme.spacing.unit * 2,
    overflow: 'hidden',
    position: 'relative',
  },

  previewImage: {
    height: '100%',
    objectFit: 'contain',
    position: 'absolute',
    width: '100%',
  },

  previewImageGreyscale: {
    filter: 'grayscale(100%)',
  },

  previewImageMask: {
    maskImage: 'linear-gradient(to right, black 0%, transparent 0%)',
  },

  cardMedia: {
    backgroundSize: 'contain',
    borderRadius: 4,
    height: 250,
    margin: '16px 16px 0',
  },

  cardContent: {
    paddingBottom: 0,
  },

  cardActions: {
    paddingTop: 0,
  },
}))(FlowFileUploader);

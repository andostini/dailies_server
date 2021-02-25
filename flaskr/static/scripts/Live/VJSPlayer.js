import React from 'react';
import videojs from 'video.js';



export default class VJSPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 'Initiliasing',
            failCounter: 0
        }
        this.checkStatus = this.checkStatus.bind(this);
    }

    componentDidMount() {
        this.checkStatus(this.props.streamSource)
        this.player = videojs(this.videoNode, this.props)
    }

    componentWillUnmount() {
        if (this.player) {
            this.player.dispose()
        }
    }

    checkStatus(src) {
        fetch(src)
            .then(res => {
                if (res.status == '404') {

                    if (this.state.status != 'Offline') {
                        if (this.state.failCounter > 2 || this.state.status == 'Initiliasing') { 
                            this.player.src({
                                src: '../static/video/fallbackLive' + this.props.streamInfo.camera + '.mp4',
                                type: 'video/mp4'
                            });

                            this.setState({
                                status: 'Offline',
                                failCounter: this.state.failCounter + 1
                            });
                        }
                        else {
                            this.setState({
                                failCounter: this.state.failCounter + 1
                            });
                        }
                    }

                }
                else {
                    if (this.state.status != 'Online') {
                        this.player.src({
                            src: this.props.streamSource,
                            type: 'application/x-mpegURL'
                        });
                        this.setState({
                            status: 'Online',
                            failCounter: 0
                        })
                    }
                }

                setTimeout(() => this.checkStatus(src), 8000)

            }
            );
    }

    render() {
        const streamInfo = this.props.streamInfo;
        const status = this.state.status;
        return (
            <React.Fragment>
                <div className='liveOverlay'>
                    Camera {streamInfo.camera} - <span style={{ color: (status == 'Online') ? 'green' : 'red' }}>{status}</span>
                </div>
                <div data-vjs-player>
                    <video ref={node => this.videoNode = node} className='video-js vjs-default-skin vjs-16-9' controls preload='false' loop></video>
                </div>
            </React.Fragment>
        )
    }
}


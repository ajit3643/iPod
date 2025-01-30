import React from "react";

// import css file
import "./CSS/App.css";
// Import iPod body file
import Case from "./Components/Case.js";

// Import songs
import song1 from "./static/Songs/Do-You-Know.mp3";
import song2 from "./static/Songs/HassHass.mp3";
import song3 from "./static/Songs/Love-Ya.mp3";
import song5 from "./static/Songs/Unstoppable.mp3";
import song6 from "./static/Songs/Yimmy Yimmy.mp3";
import song7 from "./static/Songs/Zoobi Doobi.mp3";
import song8 from "./static/Songs/Behti Hawa Sa Tha Woh.mp3";
import song9 from "./static/Songs/Give Me Some Sunshine.mp3";

// Import song cover images
import song1Img from "./static/Diljit-Dosanjh.jpg";
import song2Img from "./static/Hass-Hass.jpg";
import song3Img from "./static/Love-Ya.jpg";
import song5Img from "./static/Unstoppable.jpg";
import song6Img from "./static/Yimmy Yimmy.jpg";
import song7Img from "./static/3Idiots.jpg";
import song8Img from "./static/Behti Hawa Sa Tha Woh.jpg";
import song9Img from "./static/Give Me Some Sunshine.jpg";

// Import wallpapers
import ThomasKelley from "./static/ThomasKelley.jpg";
import Guitar from "./static/Guitar.jpg";
import TeaMusic from "./static/TeaMusic.jpg";
import FrontScreen from "./static/FrontScreen.png";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      active: 0, //Active list item
      menuItems: ["Now Playing", "Music", "Games", "Settings"], //menu Items
      musicItems: ["All Songs", "Artist", "Albums"], //Items in music
      songItemsUrl: [song1, song2, song3, song5, song6, song7, song8, song9], //songs list
      songImgItemsUrl: [
        song1Img,
        song2Img,
        song3Img,
        song5Img,
        song6Img,
        song7Img,
        song8Img,
        song9Img,
      ], //song images list
      wallpaperItems: [ThomasKelley, Guitar, TeaMusic, FrontScreen], //wallpapers
      songItems: [
        "Do You Know",
        "Hass Hass",
        "Love Ya",
        "Unstoppable",
        "Yimmy Yimmy",
        "Zoobi Doobi",
        "Behti Hawa Sa Tha Woh",
        "Give Me Some Sunshine",
      ], //song names
      songIndex: 0, //current song
      lengthMenuKey: { "-1": 3, 1: 2, 4: 7, 8: 4, 3: 2, 9: 3, 10: 4 }, //length of a particular menu
      menuMapping: {
        "-1": [0, 1, 2, 3],
        1: [4, 5, 6],
        3: [8, 9, 10],
        10: [0, 1, 2, 3],
        4: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      }, //which menu can be rendered by key menu
      currentMenu: -2, //current menu which is lockscreen initially
      navigationStack: [], //Used for navigation forward and backward
      songUrl: song1, //current song url
      playing: false, //playing or not
      theme: "rgb(210, 210, 210)", //current body theme
      audio: new Audio(song2), //current audio file
      songImgUrl: song1Img, //current song img for now playing
      wheelColor: "white", //current wheel color
      wallpaper: 0, //current wallpaper
      noty: false, // has to show notification or not
      notifyText: "Wallpaper Changed", //notification text
    };
  }

  // FUNCTION FOR : ON LONG PRESS OF FORWARD BUTTON TRACKS ARE SEEKED FORWARD
  seekSongForward = (e) => {
    if (this.state.currentMenu === -2) {
      return;
    }
    if (this.state.playing === false) {
      return;
    }
    if (e.detail.interval < 250) {
      this.state.audio.pause();
      let songIndex = this.state.songIndex;
      if (songIndex === this.state.songItemsUrl.length - 1) {
        songIndex = 0;
      } else {
        songIndex++;
      }
      const songUrl = this.state.songItemsUrl[songIndex];
      const songImgUrl = this.state.songImgItemsUrl[songIndex];
      this.setState(
        {
          songIndex: songIndex,
          songImgUrl: songImgUrl,
          songUrl: songUrl,
          audio: new Audio(songUrl),
        },
        () => {
          this.state.audio.play();
        }
      );
    } else if (e.detail.interval > 250 && e.detail.interval < 10000) {
      const interval = e.detail.interval / 100;
      this.setState((prevState) => {
        prevState.audio.currentTime += interval;
        return prevState;
      });
    }
  };

  // FUNCTION FOR : ON LONG PRESS OF FORWARD BUTTON TRACKS ARE SEEKED BACKWARD
  seekSongReverse = (e) => {
    if (this.state.currentMenu === -2) {
      return;
    }
    if (this.state.playing === false) {
      return;
    }
    console.log(e.detail.interval);
    if (e.detail.interval < 250) {
      this.state.audio.pause();
      let songIndex = this.state.songIndex;
      if (songIndex === 0) {
        songIndex = this.state.songItemsUrl.length - 1;
      } else {
        songIndex--;
      }
      const songUrl = this.state.songItemsUrl[songIndex];
      const songImgUrl = this.state.songImgItemsUrl[songIndex];
      this.setState(
        {
          songIndex: songIndex,
          songImgUrl: songImgUrl,
          songUrl: songUrl,
          audio: new Audio(songUrl),
        },
        () => {
          this.state.audio.play();
        }
      );
    } else if (e.detail.interval > 250 && e.detail.interval < 10000) {
      const interval = e.detail.interval / 100;
      this.setState((prevState) => {
        prevState.audio.currentTime -= interval;
        return prevState;
      });
    }
  };

  // FUNCTION FOR : TOGGLE SONG PLAY AND PAUSE
  togglePlayPause = () => {
    if (this.state.currentMenu === -2) {
      return;
    }
    if (this.state.playing === true) {
      this.setState({ playing: false });
      this.state.audio.pause();
    } else {
      this.setState({ playing: true });
      this.state.audio.play();
    }
  };

  // FUNCTION FOR : UPDATE ACTIVE MENU WHILE ROTATING ON THE TRACK-WHEEL
  updateActiveMenu = (direction, menu) => {
    if (
      menu !== -1 &&
      menu !== 1 &&
      menu !== 4 &&
      menu !== 8 &&
      menu !== 3 &&
      menu !== 9 &&
      menu !== 10
    ) {
      return;
    }
    let min = 0;
    let max = 0;

    max = this.state.lengthMenuKey[menu];

    if (direction === 1) {
      if (this.state.active >= max) {
        this.setState({ active: min });
      } else {
        this.setState({ active: this.state.active + 1 });
      }
    } else {
      if (this.state.active <= min) {
        this.setState({ active: max });
      } else {
        this.setState({ active: this.state.active - 1 });
      }
    }
  };

  // FUNCTION FOR : CHANGE THE THEME OF iPod BODY
  setTheme = (id) => {
    let theme = "";
    if (id === 0) {
      theme = "#FDDCD7";
    } else if (id === 1) {
      theme = "rgb(210, 210, 210)";
    } else if (id === 2) {
      theme = "#F5DDC5";
    } else if (id === 3) {
      theme = "#D1CDDA";
    } else if (id === 4) {
      theme = "black";
    }
    this.setState({ theme: theme, noty: true, notifyText: "Theme Changed" });
    return;
  };

  // FUNCTION FOR : CHANGE COLOR OF WHEEL
  setWheelColor = (id) => {
    let wheelColor = "";
    if (id === 0) {
      wheelColor = "#212121";
    } else if (id === 1) {
      wheelColor = "white";
    } else if (id === 2) {
      wheelColor = "#3E2723";
    } else if (id === 3) {
      wheelColor = "#3D5AFE";
    }
    this.setState({
      wheelColor: wheelColor,
      noty: true,
      notifyText: "Wheel Color Changed",
    });
    return;
  };

  // FUNCTION FOR : SET WALLPAPER OF iPod Body
  setWallpaper = (id) => {
    this.setState({
      wallpaper: id,
      noty: true,
      notifyText: "Wallpaper Changed",
    });
    return;
  };

  // FUNCTION FOR : CHANGE PLAYING MUSIC
  chagePlayingSongFromMusicMenu = (id, navigationStack) => {
    const songUrl = this.state.songItemsUrl[id];
    const songImgUrl = this.state.songImgItemsUrl[id];
    this.state.audio.pause();
    this.setState(
      {
        currentMenu: 7,
        songUrl: songUrl,
        navigationStack: navigationStack,
        active: 0,
        playing: true,
        songIndex: id,
        audio: new Audio(songUrl),
        songImgUrl: songImgUrl,
      },
      () => {
        this.state.audio.play();
      }
    );
    return;
  };

  // FUNCTION FOR : CHANGE MENU BACKWARDS on PRESS OF CENTER BUTTON
  changeMenuBackward = () => {
    const navigationStack = this.state.navigationStack.slice();
    if (this.state.currentMenu === -2) {
      return;
    } else {
      const prevId = navigationStack.pop();
      this.setState({
        currentMenu: prevId,
        navigationStack: navigationStack,
        active: 0,
      });
      return;
    }
  };

  // FUNCTION FOR : CHANGE MENU FORWARD on PRESS OF CENTER BUTTON using NAVIGATION STACK
  changeMenuForward = (id, fromMenu) => {
    const navigationStack = this.state.navigationStack.slice();

    if (
      fromMenu !== -2 &&
      fromMenu !== -1 &&
      fromMenu !== 1 &&
      fromMenu !== 4 &&
      fromMenu !== 3 &&
      fromMenu !== 8 &&
      fromMenu !== 9 &&
      fromMenu !== 0 &&
      fromMenu !== 7 &&
      fromMenu !== 10
    ) {
      return;
    }

    if (fromMenu === -2) {
      navigationStack.push(this.state.currentMenu);
      this.setState({
        currentMenu: -1,
        navigationStack: navigationStack,
        active: 0,
      });
      return;
    }

    if (fromMenu === -1) {
      navigationStack.push(this.state.currentMenu);
      this.setState({
        currentMenu: id,
        navigationStack: navigationStack,
        active: 0,
      });
      return;
    }

    if (fromMenu === 7 || fromMenu === 0) {
      this.togglePlayPause();
      return;
    }

    if (fromMenu === 8) {
      this.setTheme(id);
      return;
    }

    if (fromMenu === 9) {
      this.setWheelColor(id);
      return;
    }

    if (fromMenu === 10) {
      this.setWallpaper(id);
      return;
    }

    navigationStack.push(this.state.currentMenu);

    if (fromMenu === 4) {
      this.chagePlayingSongFromMusicMenu(id, navigationStack, fromMenu);
      return;
    }

    const currentMenuID = this.state.menuMapping[fromMenu][id];
    this.setState({
      currentMenu: currentMenuID,
      navigationStack: navigationStack,
      active: 0,
    });
  };

  // FUNCTION FOR : SET NOTIFICATION AS FALSE AFTER SENDING NOTIFICATION
  setNoty = () => {
    this.setState({ noty: false });
    return;
  };

  // FUNCTION FOR : RENDERING APP
  render() {
    const {
      audio,
      active,
      currentMenu,
      menuItems,
      musicItems,
      songItems,
      playing,
      songIndex,
      theme,
      songUrl,
      songImgUrl,
      wheelColor,
      wallpaper,
      wallpaperItems,
      noty,
      notifyText,
    } = this.state;
    return (
      <div className="App">
        <Case
          songIndex={songIndex}
          active={active}
          menuItems={menuItems}
          musicItems={musicItems}
          currentMenu={currentMenu}
          changeMenuForward={this.changeMenuForward}
          changeMenuBackward={this.changeMenuBackward}
          updateActiveMenu={this.updateActiveMenu}
          togglePlayPause={this.togglePlayPause}
          songItems={songItems}
          playing={playing}
          theme={theme}
          audio={audio}
          songUrl={songUrl}
          songImgUrl={songImgUrl}
          seekSongForward={this.seekSongForward}
          seekSongReverse={this.seekSongReverse}
          wheelColor={wheelColor}
          wallpaper={wallpaper}
          wallpaperItems={wallpaperItems}
          noty={noty}
          setNoty={this.setNoty}
          notifyText={notifyText}
        />
      </div>
    );
  }
}

export default App;

import { useEffect, useMemo, useRef, useState } from "react";
import {
  abilityLabels,
  birdMentor,
  femalePortrait,
  femaleToken,
  malePortrait,
  maleToken,
  officeMap,
  scenes,
  startCover,
  sufuBackground,
  summaryHero,
} from "./data/scenes";
import {
  getRadarScores,
  initialSave,
  loadSave,
  persistSave,
  pickVariantId,
  resetSave,
} from "./lib/game";
import type { AbilityKey, GameSave, Gender, PlayerProfile, Scene } from "./types";

const sounds = {
  intro: new URL("../sound/intro.mp3", import.meta.url).href,
  body: new URL("../sound/body.mp3", import.meta.url).href,
  victory: new URL("../sound/victory.mp3", import.meta.url).href,
};

const prologueParts = (profile: PlayerProfile) => {
  const child = profile.gender === "male" ? "独子" : "独女";
  const title = profile.gender === "male" ? "公子" : "小姐";

  return [
    `你是江南苏家的${child}，十七年来最大的烦恼，是明日诗会上该穿哪一件云锦。`,
    "变故发生在一夜之间。后花园的月亮很圆，一只彩色鹦鹉落在假山上，歪着头看了你很久。",
    `它忽然开口，声音像一个慈祥的老人：${title}，你过了十七年什么都不缺的日子，但你知道自己缺什么吗？`,
    `再睁开眼时，你躺在深圳一间逼仄的出租屋里。你现在叫“${profile.name}”，明天上午九点，要去一家科技公司报到。`,
    "鹦鹉蹲在窗台上说：真正的富贵，从来不是你穿什么，而是你遇到事情的时候，知道该怎么办。",
  ];
};

const getScene = (save: GameSave) => scenes[save.currentSceneIndex] ?? scenes[0];

function App() {
  const [save, setSave] = useState<GameSave>(() => loadSave());
  const [profileDraft, setProfileDraft] = useState<PlayerProfile>({
    name: "苏小满",
    gender: "male",
  });
  const [storyIndex, setStoryIndex] = useState(0);
  const [activeChoiceId, setActiveChoiceId] = useState<string | null>(null);
  const [walking, setWalking] = useState(false);
  const introAudioRef = useRef<HTMLAudioElement>(null);
  const bodyAudioRef = useRef<HTMLAudioElement>(null);
  const victoryAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    persistSave(save);
  }, [save]);

  useEffect(() => {
    const tracks = [
      introAudioRef.current,
      bodyAudioRef.current,
      victoryAudioRef.current,
    ].filter((track): track is HTMLAudioElement => Boolean(track));
    const nextTrack =
      save.phase === "prologue"
        ? introAudioRef.current
        : save.phase === "map" || save.phase === "scene"
          ? bodyAudioRef.current
          : save.phase === "summary"
            ? victoryAudioRef.current
            : null;

    tracks.forEach((track) => {
      track.volume = 0.58;
      track.loop = track !== victoryAudioRef.current;
      if (track !== nextTrack) {
        track.pause();
        track.currentTime = 0;
      }
    });

    if (!nextTrack) return;

    const playPromise = nextTrack.play();
    if (playPromise) {
      playPromise.catch(() => {
        // Browsers may block audio until the next user gesture. Later clicks will retry on phase changes.
      });
    }
  }, [save.phase]);

  const currentScene = getScene(save);
  const selectedScene = useMemo(
    () => scenes.find((scene) => scene.id === save.selectedSceneId) ?? currentScene,
    [currentScene, save.selectedSceneId],
  );
  const selectedVariant = selectedScene.variants.find(
    (variant) => variant.id === save.variants[selectedScene.id],
  );
  const selectedChoice = selectedScene.choices.find((choice) => choice.id === activeChoiceId);

  const updateSave = (next: Partial<GameSave>) => {
    setSave((previous) => ({ ...previous, ...next }));
  };

  const hardRestart = () => {
    resetSave();
    setSave(initialSave);
    setStoryIndex(0);
    setActiveChoiceId(null);
    setWalking(false);
  };

  const beginProfile = () => {
    updateSave({ phase: "profile" });
  };

  const submitProfile = () => {
    const name = profileDraft.name.trim() || "苏小满";
    updateSave({
      phase: "prologue",
      profile: { ...profileDraft, name },
      currentSceneIndex: 0,
      selectedSceneId: null,
      choices: {},
      variants: {},
      completedSceneIds: [],
    });
    setStoryIndex(0);
  };

  const enterMap = () => {
    updateSave({ phase: "map" });
  };

  const openScene = (scene: Scene) => {
    const variantId = save.variants[scene.id] || pickVariantId(scene.id);
    updateSave({
      phase: "scene",
      selectedSceneId: scene.id,
      variants: { ...save.variants, [scene.id]: variantId },
    });
    setActiveChoiceId(null);
    setWalking(true);
    window.setTimeout(() => setWalking(false), 1500);
  };

  const choose = (choiceId: string) => {
    setActiveChoiceId(choiceId);
  };

  const nextScene = () => {
    const completed = Array.from(new Set([...save.completedSceneIds, selectedScene.id]));
    const nextIndex = save.currentSceneIndex + 1;
    const choices = activeChoiceId
      ? { ...save.choices, [selectedScene.id]: activeChoiceId }
      : save.choices;

    setActiveChoiceId(null);

    if (nextIndex >= scenes.length) {
      updateSave({
        phase: "summary",
        choices,
        completedSceneIds: completed,
        currentSceneIndex: scenes.length - 1,
        selectedSceneId: null,
      });
      return;
    }

    updateSave({
      phase: "map",
      choices,
      completedSceneIds: completed,
      currentSceneIndex: nextIndex,
      selectedSceneId: null,
    });
  };

  return (
    <main className="app-shell">
      <audio ref={introAudioRef} src={sounds.intro} preload="auto" />
      <audio ref={bodyAudioRef} src={sounds.body} preload="auto" />
      <audio ref={victoryAudioRef} src={sounds.victory} preload="auto" />
      {save.phase === "home" && (
        <HomeScreen
          hasSave={save.profile !== null || save.completedSceneIds.length > 0}
          onStart={beginProfile}
          onContinue={() =>
            updateSave({
              phase: save.profile
                ? save.completedSceneIds.length >= scenes.length
                  ? "summary"
                  : "map"
                : "profile",
            })
          }
          onRestart={hardRestart}
        />
      )}

      {save.phase === "profile" && (
        <ProfileScreen draft={profileDraft} onChange={setProfileDraft} onSubmit={submitProfile} />
      )}

      {save.phase === "prologue" && save.profile && (
        <PrologueScreen
          profile={save.profile}
          storyIndex={storyIndex}
          onNext={() => {
            if (storyIndex >= prologueParts(save.profile!).length - 1) enterMap();
            else setStoryIndex((value) => value + 1);
          }}
        />
      )}

      {save.phase === "map" && save.profile && (
        <MapScreen
          save={save}
          profile={save.profile}
          onOpenScene={openScene}
          onHome={() => updateSave({ phase: "home" })}
        />
      )}

      {save.phase === "scene" && save.profile && (
        <SceneScreen
          scene={selectedScene}
          profile={save.profile}
          variantLabel={selectedVariant?.label ?? ""}
          variantNote={selectedVariant?.note ?? ""}
          selectedChoiceId={activeChoiceId}
          selectedChoice={selectedChoice}
          walking={walking}
          onChoose={choose}
          onNext={nextScene}
        />
      )}

      {save.phase === "summary" && save.profile && (
        <SummaryScreen save={save} profile={save.profile} onRestart={hardRestart} />
      )}
    </main>
  );
}

function HomeScreen({
  hasSave,
  onStart,
  onContinue,
  onRestart,
}: {
  hasSave: boolean;
  onStart: () => void;
  onContinue: () => void;
  onRestart: () => void;
}) {
  return (
    <section className="home-screen" style={{ backgroundImage: `url(${startCover})` }}>
      <div className="home-vignette" />
      <div className="home-actions">
        <button className="primary-action" onClick={hasSave ? onContinue : onStart}>
          {hasSave ? "继续职场重生" : "开始职场重生"}
        </button>
        {hasSave && (
          <button className="ghost-action" onClick={onRestart}>
            重新开始
          </button>
        )}
      </div>
    </section>
  );
}

function ProfileScreen({
  draft,
  onChange,
  onSubmit,
}: {
  draft: PlayerProfile;
  onChange: (profile: PlayerProfile) => void;
  onSubmit: () => void;
}) {
  return (
    <section className="ancient-screen">
      <img className="ancient-bg" src={sufuBackground} alt="" aria-hidden="true" />
      <div className="silk-panel">
        <p className="eyebrow">江南苏府</p>
        <h1>你在旧梦里醒来</h1>
        <div className="gender-grid" role="radiogroup" aria-label="选择性别">
          <button
            className={draft.gender === "male" ? "gender-card selected" : "gender-card"}
            onClick={() => onChange({ ...draft, gender: "male" })}
          >
            <span className="gender-portrait" style={{ backgroundImage: `url(${malePortrait})` }} />
            <span className="gender-title">贵公子</span>
            <span>锦衣玉食，初入凡尘</span>
          </button>
          <button
            className={draft.gender === "female" ? "gender-card selected" : "gender-card"}
            onClick={() => onChange({ ...draft, gender: "female" })}
          >
            <span className="gender-portrait" style={{ backgroundImage: `url(${femalePortrait})` }} />
            <span className="gender-title">贵小姐</span>
            <span>云鬓明眸，不识职场</span>
          </button>
        </div>
        <label className="name-field">
          <span>来到深圳后，你叫什么名字？</span>
          <input
            value={draft.name}
            maxLength={8}
            onChange={(event) => onChange({ ...draft, name: event.target.value })}
          />
        </label>
        <button className="primary-action" onClick={onSubmit}>
          写下命数
        </button>
      </div>
    </section>
  );
}

function PrologueScreen({
  profile,
  storyIndex,
  onNext,
}: {
  profile: PlayerProfile;
  storyIndex: number;
  onNext: () => void;
}) {
  const parts = prologueParts(profile);

  return (
    <section className="ancient-screen prologue-screen">
      <img className="ancient-bg" src={sufuBackground} alt="" aria-hidden="true" />
      <div className="story-scroll">
        <p className="eyebrow">序章</p>
        <h1>从云锦到工牌</h1>
        <div className="story-lines">
          {parts.slice(0, storyIndex + 1).map((part) => (
            <p key={part}>{part}</p>
          ))}
        </div>
        <button className="primary-action" onClick={onNext}>
          {storyIndex >= parts.length - 1 ? "穿越到深圳" : "继续"}
        </button>
      </div>
    </section>
  );
}

function MapScreen({
  save,
  profile,
  onOpenScene,
  onHome,
}: {
  save: GameSave;
  profile: PlayerProfile;
  onOpenScene: (scene: Scene) => void;
  onHome: () => void;
}) {
  const currentScene = getScene(save);
  const token = profile.gender === "female" ? femaleToken : maleToken;
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = railRef.current?.querySelector(".scene-stop.current");
    current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [save.currentSceneIndex]);

  return (
    <section className="map-screen">
      <header className="top-bar">
        <div>
          <p className="eyebrow">第 {currentScene.day} 天</p>
          <h1>{currentScene.title}</h1>
        </div>
        <button className="small-action" onClick={onHome} aria-label="回到首页">
          首页
        </button>
      </header>

      <div className="map-window">
        <img className="office-map" src={officeMap} alt="Nexora Solutions 办公室地图" />
        <div
          className={`map-token ${profile.gender}`}
          style={{ left: `${currentScene.mapX}%`, backgroundImage: `url(${token})` }}
          aria-hidden="true"
        />
      </div>

      <div className="scene-rail" ref={railRef} aria-label="滑动探索场景">
        {scenes.map((scene, index) => {
          const state =
            index < save.currentSceneIndex
              ? "done"
              : index === save.currentSceneIndex
                ? "current"
                : "locked";
          return (
            <article className={`scene-stop ${state}`} key={scene.id}>
              <p>{scene.time}</p>
              <h2>{scene.title}</h2>
              <span>{scene.location}</span>
              <button disabled={state !== "current"} onClick={() => onOpenScene(scene)}>
                {state === "done" ? "已经历" : state === "current" ? "进入场景" : "未解锁"}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function SceneScreen({
  scene,
  profile,
  variantLabel,
  variantNote,
  selectedChoiceId,
  selectedChoice,
  walking,
  onChoose,
  onNext,
}: {
  scene: Scene;
  profile: PlayerProfile;
  variantLabel: string;
  variantNote: string;
  selectedChoiceId: string | null;
  selectedChoice?: Scene["choices"][number];
  walking: boolean;
  onChoose: (choiceId: string) => void;
  onNext: () => void;
}) {
  const token = profile.gender === "female" ? femaleToken : maleToken;
  const [visibleChars, setVisibleChars] = useState(0);
  const [choicesReady, setChoicesReady] = useState(false);
  const questionText = scene.description;

  useEffect(() => {
    setVisibleChars(0);
    setChoicesReady(false);
  }, [scene.id]);

  useEffect(() => {
    if (walking || selectedChoiceId) return;
    if (visibleChars >= questionText.length) {
      const revealTimer = window.setTimeout(() => setChoicesReady(true), 140);
      return () => window.clearTimeout(revealTimer);
    }

    const timer = window.setTimeout(() => {
      setVisibleChars((value) => Math.min(questionText.length, value + 2));
    }, 18);

    return () => window.clearTimeout(timer);
  }, [questionText.length, selectedChoiceId, visibleChars, walking]);

  return (
    <section className="scene-screen">
      <div className="scene-stage">
        <img src={scene.background} alt={scene.location} />
        {scene.npcs.map((npc) => (
          <div
            className={`stage-npc ${npc.kind}`}
            key={npc.id}
            style={{
              backgroundImage: `url(${npc.image})`,
              left: `${npc.x}%`,
              bottom: `${npc.y}%`,
              transform: `translateX(-50%) scale(${npc.scale ?? 1})`,
            }}
            aria-label={npc.name}
          />
        ))}
        <div
          className={`stage-token ${walking ? "walking" : ""} ${profile.gender}`}
          style={{ backgroundImage: `url(${token})` }}
          aria-hidden="true"
        />
      </div>

      <div className="narrative-panel">
        <div className="scene-meta">
          <span>{scene.time}</span>
          <span>{variantLabel}</span>
        </div>
        <h1>{scene.title}</h1>
        <p className="typewriter-text">{questionText.slice(0, visibleChars)}</p>
        {!walking && visibleChars >= questionText.length && <p className="variant-note">{variantNote}</p>}
      </div>

      {!selectedChoiceId && !walking && choicesReady && (
        <>
          <MentorBubble text={scene.mentorBefore} variant="tip" />
          <div className="choice-list reveal">
            {scene.choices.map((choice) => (
              <button key={choice.id} onClick={() => onChoose(choice.id)}>
                {choice.text}
              </button>
            ))}
          </div>
        </>
      )}

      {walking && <div className="walking-hint">人物正在进入场景...</div>}

      {selectedChoice && (
        <div className="result-panel">
          <p className="eyebrow">你的选择</p>
          <h2>{selectedChoice.text}</h2>
          <p>{selectedChoice.result}</p>
          <MentorBubble text={selectedChoice.mentor} />
          <button className="primary-action" onClick={onNext}>
            {scene.id === scenes[scenes.length - 1].id ? "查看第一周总结" : "进入下一幕"}
          </button>
        </div>
      )}
    </section>
  );
}

function MentorBubble({ text, variant = "bubble" }: { text: string; variant?: "bubble" | "tip" }) {
  return (
    <aside className={`mentor-bubble ${variant}`}>
      <span className="mentor-avatar" style={{ backgroundImage: `url(${birdMentor})` }} aria-label="鸟导师" />
      <p>{text}</p>
    </aside>
  );
}

function SummaryScreen({
  save,
  profile,
  onRestart,
}: {
  save: GameSave;
  profile: PlayerProfile;
  onRestart: () => void;
}) {
  const scores = getRadarScores(save.choices);
  const strongest = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0] as AbilityKey;

  return (
    <section className="summary-screen">
      <img className="summary-hero" src={summaryHero} alt="第一周通关庆祝" />
      <div className="summary-header">
        <p className="eyebrow">第一周完成</p>
        <h1>{profile.name}，你活下来了，也长出来了</h1>
        <p>
          你还不是完美的职场人，但已经开始拥有一件很珍贵的东西：遇到事情时，先停一下，想清楚，再行动。
        </p>
      </div>
      <RadarChart scores={scores} />
      <div className="summary-note">
        <h2>这一周最亮的能力：{abilityLabels[strongest]}</h2>
        <p>
          这不是系统给你的奖状，而是一面镜子。真正的成长，来自你愿意复盘每个选择背后的动机、代价和下一次的改法。
        </p>
      </div>
      <button className="primary-action" onClick={onRestart}>
        开启下段旅程
      </button>
    </section>
  );
}

function RadarChart({ scores }: { scores: Record<AbilityKey, number> }) {
  const keys = Object.keys(scores) as AbilityKey[];
  const center = 120;
  const maxRadius = 72;
  const points = keys.map((key, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / keys.length;
    const radius = (scores[key] / 100) * maxRadius;
    return {
      key,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
      labelX: center + Math.cos(angle) * 96,
      labelY: center + Math.sin(angle) * 96,
    };
  });
  const polygon = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="radar-wrap">
      <svg viewBox="0 0 240 240" role="img" aria-label="五维能力雷达图">
        {[0.25, 0.5, 0.75, 1].map((level) => (
          <polygon
            key={level}
            points={keys
              .map((_, index) => {
                const angle = -Math.PI / 2 + (index * Math.PI * 2) / keys.length;
                return `${center + Math.cos(angle) * maxRadius * level},${
                  center + Math.sin(angle) * maxRadius * level
                }`;
              })
              .join(" ")}
            className="radar-grid"
          />
        ))}
        {points.map((point) => (
          <line key={point.key} x1={center} y1={center} x2={point.labelX} y2={point.labelY} />
        ))}
        <polygon points={polygon} className="radar-score" />
        {points.map((point) => (
          <text key={point.key} x={point.labelX} y={point.labelY}>
            {abilityLabels[point.key]}
          </text>
        ))}
      </svg>
      <div className="score-list">
        {keys.map((key) => (
          <span key={key}>
            {abilityLabels[key]} <strong>{scores[key]}</strong>
          </span>
        ))}
      </div>
    </div>
  );
}

export default App;

import {
  BASE_CHAT_MESSAGES,
  CAPTURED_NOTICE,
  FEATURE_REWRITE_EXAMPLES,
  FEATURE_SCENES,
  SAVED_PITCH_NOTE,
  SHOPPING_CAPTURE,
  STORY_SCENES,
} from './demo-fixtures.js'
import { renderPhoneState, updatePhoneTyping } from './demo-renderer.js'
import { initPhoneFinish, initPhoneModel } from './phone-model.js'

const clone = value => JSON.parse(JSON.stringify(value))

function buildBaseState(overrides = {}) {
  return {
    time: '3:18',
    screen: 'launcher',
    monologTab: 'today',
    libraryQuery: '',
    libraryFilter: 'All',
    libraryDetailId: null,
    screenshotOpen: false,
    journalQuery: '',
    journalAnswer: null,
    journalRecapText: null,
    journalPeriod: 'Day',
    journalView: 'Timeline',
    journalOpenDay: null,
    chatMessages: clone(BASE_CHAT_MESSAGES),
    chatNotification: false,
    draftText: '',
    keyboardOpen: false,
    keyboardTheme: null,
    keyboardHeight: 'normal',
    keyboardMode: 'letters',
    incognito: false,
    suggestionPill: null,
    rewriteBarOpen: false,
    activeRewriteStyle: null,
    rewritePreview: null,
    swipeTrailWord: null,
    voxStatus: 'Listening…',
    voxTranscript: '',
    voxFiller: '',
    voxPaused: false,
    voxSubtext: 'Pause-tolerant · Speaks naturally',
    voxLanguage: 'English (India)',
    voxLanguagesOpen: false,
    aiQuery: '',
    aiPersonal: false,
    aiWeb: false,
    aiSearching: false,
    aiResult: null,
    shortcutForm: null,
    captureNote: '',
    captureRecording: false,
    captureVoice: false,
    noteTitle: '',
    noteBody: '',
    savedNote: null,
    captureCropped: false,
    capturePins: [],
    savedReminder: null,
    savedCapture: null,
    savedShopping: null,
    shoppingCapture: false,
    toast: null,
    transitionBanner: null,
    featurePill: null,
    featureSubView: null,
    activeKey: null,
    ...overrides,
  }
}

const MSG_POLISHED = {
  id: 'justysss-1',
  from: 'justysss',
  text: 'Yes, let’s rehearse at 3:30 PM. I’ll open with Vox.',
  time: '3:19 PM',
}

const MSG_VOX = {
  id: 'justysss-2',
  from: 'justysss',
  text: 'I’ll bring the HDMI adapter. Can you bring the backup phone?',
  time: '3:20 PM',
}

const SAVED_REMINDER = {
  title: 'Rehearse the Monolog pitch',
  time: 'Today, 3:30 PM',
}

const STORY_FLOWS = [
  // 01: Android home screen
  {
    settledState: () => buildBaseState({ screen: 'launcher', time: '3:18' }),
    async play(ctx) {
      ctx.render(this.settledState())
    },
  },

  // 02: Open Monolog (tap -> splash -> Today)
  {
    settledState: () => buildBaseState({
      screen: 'monolog',
      monologTab: 'today',
      time: '3:18',
    }),
    async play(ctx) {
      const s = buildBaseState({ screen: 'launcher', time: '3:18' })
      ctx.render(s)
      await ctx.wait(180)
      await ctx.tap('.launcher-icon-monolog')
      ctx.render(buildBaseState({ screen: 'splash', time: '3:18' }))
      await ctx.wait(880)
      const today = this.settledState()
      ctx.render(today)
      await ctx.wait(1150)
      await ctx.guide('[data-demo-target="journal-ask-input"]', 'Tap the Ask bar to open the keyboard')
      today.keyboardOpen = true
      ctx.render(today)
      await ctx.guide('[data-demo-target="key-m"]', 'Hold m to open Quick shortcuts', 'hold')
      today.keyboardMode = 'shortcuts'
      ctx.render(today)
      await ctx.wait(2950)
      await ctx.tap('[data-demo-target="key-m"]')
      ctx.render(this.settledState())
    },
  },

  // 03: Open WhatsApp
  {
    settledState: () => buildBaseState({
      screen: 'whatsapp',
      chatMessages: clone(BASE_CHAT_MESSAGES),
      keyboardOpen: true,
      time: '3:18',
    }),
    async play(ctx) {
      const today = STORY_FLOWS[1].settledState()
      ctx.render(today)
      await ctx.wait(550)
      ctx.render({ ...today, chatNotification: true })
      await ctx.wait(680)
      await ctx.guide('[data-demo-target="whatsapp-notification"]', 'Tap the message from ybtheflash')
      ctx.render({ ...this.settledState(), keyboardOpen: false })
      await ctx.wait(500)
      await ctx.tap('[data-demo-target="wa-composer"]')
      ctx.render(this.settledState())
    },
  },

  // 04: Polish and send a reply
  {
    settledState: () => buildBaseState({
      screen: 'whatsapp',
      chatMessages: [...clone(BASE_CHAT_MESSAGES), MSG_POLISHED],
      draftText: '',
      keyboardOpen: true,
      time: '3:19',
    }),
    async play(ctx) {
      const s = STORY_FLOWS[2].settledState()
      ctx.render(s)
      await ctx.wait(220)
      await ctx.typeInto(s, 'draftText', 'yep 330 run through ill open with vox', 32)
      await ctx.wait(250)
      await ctx.tap('[data-demo-target="kb-rewrite"]')
      s.rewriteBarOpen = true
      s.activeRewriteStyle = 'Polish'
      s.rewritePreview = {
        style: 'Polish',
        text: 'Yes, let’s rehearse at 3:30 PM. I’ll open with Vox.',
      }
      ctx.render(s)
      await ctx.wait(1100)
      await ctx.tap('[data-demo-target="rewrite-apply"]')
      s.rewriteBarOpen = false
      s.activeRewriteStyle = null
      s.rewritePreview = null
      s.draftText = 'Yes, let’s rehearse at 3:30 PM. I’ll open with Vox.'
      ctx.render(s)
      await ctx.wait(950)
      await ctx.tap('[data-demo-target="wa-send"]')
      ctx.render(this.settledState())
    },
  },

  // 05: Dictate with Vox
  {
    settledState: () => buildBaseState({
      screen: 'whatsapp',
      chatMessages: [...clone(BASE_CHAT_MESSAGES), MSG_POLISHED, MSG_VOX],
      draftText: '',
      keyboardOpen: true,
      time: '3:20',
    }),
    async play(ctx) {
      const s = STORY_FLOWS[3].settledState()
      ctx.render(s)
      await ctx.wait(220)
      await ctx.tap('[data-demo-target="kb-mic"]')
      s.keyboardMode = 'vox'
      s.voxStatus = 'Listening…'
      s.voxTranscript = ''
      ctx.render(s)
      await ctx.wait(360)
      s.voxFiller = 'Umm…'
      ctx.render(s)
      await ctx.wait(680)
      s.voxFiller = ''
      ctx.render(s)
      await ctx.typeInto(s, 'voxTranscript', 'I’ll bring the HDMI adapter.', 28)
      s.voxStatus = 'Listening through pause…'
      s.voxPaused = true
      ctx.render(s)
      await ctx.wait(780)
      s.voxStatus = 'Listening…'
      s.voxPaused = false
      ctx.render(s)
      s.voxFiller = 'uh…'
      ctx.render(s)
      await ctx.wait(680)
      s.voxFiller = ''
      ctx.render(s)
      await ctx.typeInto(s, 'voxTranscript', ' Can you bring the backup phone?', 28, true)
      await ctx.wait(520)
      await ctx.tap('[data-demo-target="vox-pause"]')
      s.voxStatus = 'Paused'
      s.voxPaused = true
      ctx.render(s)
      await ctx.wait(240)
      await ctx.tap('[data-demo-target="vox-done"]')
      s.keyboardMode = 'letters'
      s.draftText = 'I’ll bring the HDMI adapter. Can you bring the backup phone?'
      ctx.render(s)
      await ctx.wait(750)
      await ctx.tap('[data-demo-target="wa-send"]')
      ctx.render(this.settledState())
    },
  },

  // 06: Set a reminder from the keyboard
  {
    settledState: () => buildBaseState({
      screen: 'whatsapp',
      chatMessages: [...clone(BASE_CHAT_MESSAGES), MSG_POLISHED, MSG_VOX],
      draftText: '',
      keyboardOpen: true,
      savedReminder: clone(SAVED_REMINDER),
      toast: 'Reminder set · Today, 3:30 PM',
      time: '3:21',
    }),
    async play(ctx) {
      const s = STORY_FLOWS[4].settledState()
      s.time = '3:21'
      ctx.render(s)
      await ctx.guide('[data-demo-target="key-m"]', 'Hold m to open Quick shortcuts', 'hold')
      s.keyboardMode = 'shortcuts'
      ctx.render(s)
      await ctx.wait(1200)
      await ctx.guide('[data-demo-target="shortcut-reminder"]', 'Tap Reminder')
      s.keyboardMode = 'shortcut-form'
      s.shortcutForm = {
        kind: 'reminder',
        title: 'Rehearse the Monolog pitch',
        time: 'Today, 3:30 PM',
      }
      ctx.render(s)
      await ctx.wait(1750)
      await ctx.guide('[data-demo-target="shortcut-save"]', 'Save the 3:30 PM rehearsal reminder')
      ctx.render(this.settledState())
    },
  },

  // 07: Ask AI while the chat stays open
  {
    settledState: () => buildBaseState({
      screen: 'whatsapp',
      chatMessages: [...clone(BASE_CHAT_MESSAGES), MSG_POLISHED, MSG_VOX],
      draftText: 'Finalist check-in opens at 3:15 PM in Hall 2.',
      keyboardOpen: true,
      savedReminder: clone(SAVED_REMINDER),
      time: '3:22',
    }),
    async play(ctx) {
      const s = STORY_FLOWS[5].settledState()
      s.toast = null
      s.time = '3:22'
      ctx.render(s)
      await ctx.wait(220)
      await ctx.guide('[data-demo-target="kb-space"]', 'Hold the lightning spacebar to open Ask AI', 'hold')
      s.keyboardMode = 'ai'
      s.aiQuery = ''
      ctx.render(s)
      await ctx.wait(220)
      await ctx.typeInto(s, 'aiQuery', 'When does Buildathon finalist check-in open?', 22)
      await ctx.wait(280)
      await ctx.tap('[data-demo-target="ai-web-btn"]')
      s.aiWeb = true
      ctx.render(s)
      await ctx.wait(260)
      await ctx.guide('[data-demo-target="ai-search-btn"]', 'Tap Web search to look up check-in')
      s.aiSearching = true
      ctx.render(s)
      await ctx.wait(650)
      s.aiSearching = false
      s.aiResult = {
        answer: 'Finalist check-in opens at 3:15 PM in Hall 2.',
        sourceTitle: 'Buildathon finalist guide',
        insertText: 'Finalist check-in opens at 3:15 PM in Hall 2.',
      }
      ctx.render(s)
      await ctx.wait(1700)
      await ctx.guide('[data-demo-target="ai-insert-btn"]', 'Insert the answer into the draft')
      ctx.render(this.settledState())
    },
  },

  // 08: Open Quick Capture from Vox and attach a voice note
  {
    settledState: () => buildBaseState({
      screen: 'notice',
      savedReminder: clone(SAVED_REMINDER),
      savedCapture: clone(CAPTURED_NOTICE),
      toast: 'Saved to Journal',
      time: '3:23',
    }),
    async play(ctx) {
      const s = STORY_FLOWS[6].settledState()
      ctx.render(s)
      await ctx.swipeHome()
      ctx.render(buildBaseState({ time: '3:23' }))
      await ctx.wait(260)
      await ctx.tap('.launcher-icon-notice')
      const notice = buildBaseState({ screen: 'notice', time: '3:23' })
      ctx.render(notice)
      await ctx.wait(460)
      await ctx.tap('[data-demo-target="notice-search"]')
      notice.keyboardOpen = true
      ctx.render(notice)
      await ctx.wait(320)
      await ctx.tap('[data-demo-target="kb-mic"]')
      notice.keyboardMode = 'vox'
      ctx.render(notice)
      await ctx.wait(520)
      await ctx.guide('.vox-panel [data-demo-target="key-m"]', 'Tap m in Vox to capture the screen')
      notice.keyboardOpen = false
      ctx.render(notice)
      ctx.flash()
      await ctx.wait(350)

      const capture = buildBaseState({ screen: 'capture', time: '3:23' })
      ctx.render(capture)
      await ctx.wait(520)
      await ctx.tap('[data-demo-target="capture-voice"]')
      capture.captureRecording = true
      ctx.render(capture)
      await ctx.typeInto(capture, 'captureNote', CAPTURED_NOTICE.note, 28)
      await ctx.tap('[data-demo-target="capture-voice"]')
      capture.captureRecording = false
      capture.captureVoice = true
      ctx.render(capture)
      await ctx.wait(420)
      await ctx.guide('[data-demo-target="capture-save"]', 'Save the screenshot and voice note')
      ctx.render(this.settledState())
    },
  },

  // 09: Write a separate journal note
  {
    settledState: () => buildBaseState({
      screen: 'companion-note',
      savedReminder: clone(SAVED_REMINDER),
      savedCapture: clone(CAPTURED_NOTICE),
      savedNote: clone(SAVED_PITCH_NOTE),
      toast: 'Note saved',
      time: '3:24',
    }),
    async play(ctx) {
      const s = STORY_FLOWS[7].settledState()
      ctx.render(s)
      await ctx.swipeHome()
      ctx.render({ ...s, screen: 'launcher', toast: null })
      await ctx.wait(260)
      await ctx.tap('.launcher-icon-monolog')
      ctx.render({ ...s, screen: 'monolog', toast: null })
      await ctx.wait(410)
      await ctx.tap('[data-demo-target="today-add-note"]')
      const note = buildBaseState({ screen: 'companion-note', time: '3:24' })
      ctx.render(note)
      await ctx.wait(430)
      await ctx.tap('[data-demo-target="note-title"]')
      note.keyboardOpen = true
      ctx.render(note)
      await ctx.wait(320)
      await ctx.typeInto(note, 'noteTitle', SAVED_PITCH_NOTE.title, 39)
      await ctx.tap('[data-demo-target="note-body"]')
      await ctx.typeInto(note, 'noteBody', SAVED_PITCH_NOTE.preview, 29)
      await ctx.wait(430)
      await ctx.tap('[data-demo-target="note-save"]')
      ctx.render(this.settledState())
    },
  },

  // 10: Manual Incognito and automatic protection for sensitive wording
  {
    settledState: () => buildBaseState({
      screen: 'notes',
      draftText: 'My password is ••••••',
      keyboardOpen: true,
      incognito: 'detected',
      savedReminder: clone(SAVED_REMINDER),
      savedCapture: clone(CAPTURED_NOTICE),
      savedNote: clone(SAVED_PITCH_NOTE),
      time: '3:25',
    }),
    async play(ctx) {
      ctx.render(STORY_FLOWS[8].settledState())
      await ctx.swipeHome()
      const launcher = buildBaseState({ time: '3:25' })
      ctx.render(launcher)
      await ctx.wait(340)
      await ctx.tap('.launcher-icon-whatsapp')
      const chat = { ...STORY_FLOWS[5].settledState(), time: '3:25', keyboardOpen: false, toast: null }
      ctx.render(chat)
      await ctx.wait(430)
      await ctx.tap('[data-demo-target="wa-composer"]')
      chat.keyboardOpen = true
      ctx.render(chat)
      await ctx.guide('[data-demo-target="kb-period"]', 'Hold the Incognito / period key', 'hold')
      chat.incognito = 'manual'
      ctx.render(chat)
      await ctx.typeInto(chat, 'draftText', 'I’m worried I’ll rush the first minute.', 30)
      await ctx.wait(1250)
      await ctx.swipeHome()
      ctx.render(launcher)
      await ctx.wait(380)
      await ctx.tap('.launcher-icon-notes')
      const note = { ...this.settledState(), incognito: false, draftText: '', keyboardOpen: false }
      ctx.render(note)
      await ctx.wait(430)
      await ctx.tap('[data-demo-target="notes-editor"]')
      note.keyboardOpen = true
      ctx.render(note)
      await ctx.typeInto(note, 'draftText', 'My password', 70)
      note.incognito = 'detected'
      ctx.render(note)
      await ctx.wait(800)
      await ctx.typeInto(note, 'draftText', ' is ••••••', 65, true)
      ctx.render(this.settledState())
    },
  },

  // 11: Find the saved detail
  {
    settledState: () => buildBaseState({
      screen: 'monolog',
      monologTab: 'library',
      libraryFilter: 'Screenshots',
      libraryQuery: 'demo bay b',
      libraryDetailId: 'pitch-notice',
      savedReminder: clone(SAVED_REMINDER),
      savedCapture: clone(CAPTURED_NOTICE),
      savedNote: clone(SAVED_PITCH_NOTE),
      time: '3:48',
    }),
    async play(ctx) {
      const trans = STORY_FLOWS[9].settledState()
      trans.transitionBanner = 'Rehearsal ends · 3:48 PM'
      ctx.render(trans)
      await ctx.wait(920)
      await ctx.swipeHome()

      const launcher = buildBaseState({ time: '3:48' })
      ctx.render(launcher)
      await ctx.wait(340)
      await ctx.tap('.launcher-icon-monolog')
      const s = buildBaseState({
        screen: 'monolog',
        monologTab: 'today',
        savedReminder: clone(SAVED_REMINDER),
        savedCapture: clone(CAPTURED_NOTICE),
      savedNote: clone(SAVED_PITCH_NOTE),
        time: '3:48',
      })
      ctx.render(s)
      await ctx.wait(490)
      await ctx.tap('[data-demo-target="tab-library"]')
      s.monologTab = 'library'
      ctx.render(s)
      await ctx.wait(420)
      await ctx.tap('[data-demo-target="library-filter-screenshots"]')
      s.libraryFilter = 'Screenshots'
      ctx.render(s)
      await ctx.wait(260)
      await ctx.tap('[data-demo-target="library-search"]')
      await ctx.typeInto(s, 'libraryQuery', 'demo bay b', 64)
      await ctx.wait(550)
      await ctx.tap('[data-demo-target="library-pitch-card"]')
      ctx.render(this.settledState())
    },
  },

  // 12: Ask the journal and show the source
  {
    settledState: () => buildBaseState({
      screen: 'monolog',
      monologTab: 'journal',
      journalQuery: 'Where did judging move to?',
      journalAnswer: {
        text: 'Demo Bay B in Hall 2. Judging starts at 4:00 PM.',
        sourceId: 'pitch-notice',
        sourceTitle: CAPTURED_NOTICE.title,
        sourceMeta: 'Saved capture · Today, 3:23 PM',
      },
      journalRecapText: 'You set a 3:30 PM rehearsal reminder, saved the move to Demo Bay B, and wrote the pitch opening.',
      savedReminder: clone(SAVED_REMINDER),
      savedCapture: clone(CAPTURED_NOTICE),
      savedNote: clone(SAVED_PITCH_NOTE),
      time: '3:49',
    }),
    async play(ctx) {
      const capture = STORY_FLOWS[10].settledState()
      ctx.render(capture)
      await ctx.tap('[data-demo-target="library-back"]')
      ctx.render({ ...capture, libraryDetailId: null })
      await ctx.wait(260)
      await ctx.tap('[data-demo-target="tab-journal"]')
      const s = buildBaseState({
        screen: 'monolog',
        monologTab: 'journal',
        savedReminder: clone(SAVED_REMINDER),
        savedCapture: clone(CAPTURED_NOTICE),
      savedNote: clone(SAVED_PITCH_NOTE),
        time: '3:49',
      })
      ctx.render(s)
      await ctx.wait(320)
      await ctx.tap('[data-demo-target="journal-ask-input"]')
      await ctx.typeInto(s, 'journalQuery', 'Where did judging move to?', 30)
      await ctx.wait(280)
      await ctx.tap('[data-demo-target="journal-ask-submit"]')
      s.journalAnswer = {
        text: 'Demo Bay B in Hall 2. Judging starts at 4:00 PM.',
        sourceId: 'pitch-notice',
        sourceTitle: CAPTURED_NOTICE.title,
        sourceMeta: 'Saved capture · Today, 3:23 PM',
      }
      ctx.render(s)
      await ctx.wait(1100)
      await ctx.tap('[data-demo-target="journal-recap-btn"]')
      ctx.render(this.settledState())
    },
  },

  // 13: Capture a product from the Android floating shortcut
  {
    settledState: () => buildBaseState({
      screen: 'monolog',
      monologTab: 'library',
      libraryDetailId: SHOPPING_CAPTURE.id,
      savedReminder: clone(SAVED_REMINDER),
      savedCapture: clone(CAPTURED_NOTICE),
      savedNote: clone(SAVED_PITCH_NOTE),
      savedShopping: clone(SHOPPING_CAPTURE),
      time: '6:20',
    }),
    async play(ctx) {
      const s = STORY_FLOWS[11].settledState()
      ctx.render({ ...s, transitionBanner: 'After judging · 6:20 PM' })
      await ctx.wait(1050)
      await ctx.swipeHome()
      ctx.render(buildBaseState({ time: '6:20' }))
      await ctx.tap('.launcher-icon-shop')
      const shop = buildBaseState({ screen: 'shopping', time: '6:20' })
      ctx.render(shop)
      await ctx.wait(850)
      await ctx.guide('[data-demo-target="android-context"]', 'Tap Android’s floating Quick Capture shortcut')
      ctx.flash()
      await ctx.wait(320)
      const capture = buildBaseState({ screen: 'capture', shoppingCapture: true, time: '6:20' })
      ctx.render(capture)
      await ctx.wait(950)
      await ctx.typeInto(capture, 'captureNote', SHOPPING_CAPTURE.note, 30)
      await ctx.guide('[data-demo-target="capture-save"]', 'Save the product and its price')
      ctx.render({ ...shop, toast: 'Saved to Journal' })
      await ctx.wait(1020)
      await ctx.swipeHome()
      ctx.render(buildBaseState({ time: '6:20' }))
      await ctx.wait(360)
      await ctx.tap('.launcher-icon-monolog')
      const saved = this.settledState()
      ctx.render({ ...saved, monologTab: 'today', libraryDetailId: null })
      await ctx.wait(560)
      await ctx.tap('[data-demo-target="tab-library"]')
      ctx.render({ ...saved, libraryDetailId: null })
      await ctx.guide('[data-demo-target="library-shopping-card"]', 'Open the saved product in Context Library')
      ctx.render(saved)
    },
  },

  // 14: Close on Today
  {
    settledState: () => buildBaseState({
      screen: 'monolog',
      monologTab: 'today',
      journalRecapText: 'You set a 3:30 PM rehearsal reminder, saved the move to Demo Bay B, and wrote the pitch opening.',
      savedReminder: clone(SAVED_REMINDER),
      savedCapture: clone(CAPTURED_NOTICE),
      savedNote: clone(SAVED_PITCH_NOTE),
      savedShopping: clone(SHOPPING_CAPTURE),
      time: '6:20',
    }),
    async play(ctx) {
      const s = STORY_FLOWS[12].settledState()
      ctx.render(s)
      await ctx.tap('[data-demo-target="library-back"]')
      ctx.render({ ...s, libraryDetailId: null })
      await ctx.wait(650)
      await ctx.tap('[data-demo-target="tab-today"]')
      ctx.render(this.settledState())
    },
  },
]

const FEATURE_FLOWS = [
  // F1: Keyboard basics and personalization
  {
    settledState: () => buildBaseState({
      screen: 'whatsapp',
      draftText: 'hello ',
      keyboardOpen: true,
      keyboardTheme: 'ink',
      keyboardHeight: 'tall',
      keyboardMode: 'stickers',
      featurePill: 'Ink · Tall · Stickers',
      time: '3:35',
    }),
    async play(ctx) {
      const s = buildBaseState({ screen: 'whatsapp', draftText: 'teh', keyboardOpen: true, time: '3:35', featurePill: 'Autocorrect & Undo' })
      ctx.render(s)
      await ctx.wait(650)
      s.draftText = 'the '
      s.suggestionPill = { kind: 'reminder', label: 'Corrected: teh → the (Backspace undoes)' }
      ctx.render(s)
      await ctx.wait(850)
      await ctx.tap('[data-demo-target="kb-backspace"]')
      s.draftText = 'teh'
      s.suggestionPill = null
      ctx.render(s)
      await ctx.wait(700)
      s.draftText = 'hello '
      s.swipeTrailWord = 'hello'
      s.featurePill = 'Swipe typing'
      ctx.render(s)
      await ctx.wait(900)
      s.swipeTrailWord = null
      s.keyboardMode = 'clipboard'
      s.featurePill = 'Clipboard'
      ctx.render(s)
      await ctx.wait(850)
      s.keyboardMode = 'gifs'
      s.featurePill = 'GIFs (sample)'
      ctx.render(s)
      await ctx.wait(750)
      ctx.render(this.settledState())
    },
  },

  // F2: Writing tools and translation
  {
    settledState: () => buildBaseState({
      screen: 'whatsapp',
      draftText: 'Estoy a cinco minutos',
      keyboardOpen: true,
      keyboardMode: 'translate',
      featurePill: 'Tones & Translation',
      time: '3:36',
    }),
    async play(ctx) {
      const s = buildBaseState({
        screen: 'whatsapp',
        draftText: FEATURE_REWRITE_EXAMPLES.Original,
        keyboardOpen: true,
        rewriteBarOpen: true,
        activeRewriteStyle: 'Professional',
        rewritePreview: { style: 'Professional', text: FEATURE_REWRITE_EXAMPLES.Professional },
        featurePill: 'Professional',
        time: '3:36',
      })
      ctx.render(s)
      await ctx.wait(900)
      for (const style of ['Friendly', 'Shorten', 'Polish']) {
        s.activeRewriteStyle = style
        s.rewritePreview = { style, text: FEATURE_REWRITE_EXAMPLES[style] }
        s.featurePill = style
        ctx.render(s)
        await ctx.wait(720)
      }
      s.rewriteBarOpen = false
      s.rewritePreview = null
      s.draftText = 'I’m five minutes away'
      s.keyboardMode = 'translate'
      s.featurePill = 'Translation'
      ctx.render(s)
      await ctx.wait(800)
      await ctx.tap('[data-demo-target="translate-apply"]')
      ctx.render(this.settledState())
    },
  },

  // F3: Vox and voice notes
  {
    settledState: () => buildBaseState({
      screen: 'whatsapp',
      keyboardOpen: true,
      keyboardMode: 'shortcut-form',
      shortcutForm: {
        kind: 'note',
        title: 'Voice note',
        voiceTranscript: 'Bring a spare HDMI cable.',
      },
      toast: 'Voice note saved to Journal',
      featurePill: 'Vox & Voice note',
      time: '3:37',
    }),
    async play(ctx) {
      const s = buildBaseState({
        screen: 'whatsapp',
        keyboardOpen: true,
        keyboardMode: 'vox',
        voxLanguage: 'English',
        voxLanguagesOpen: true,
        voxTranscript: 'Choose English, Hindi, Spanish, and regional packs',
        featurePill: 'Vox languages',
        time: '3:37',
      })
      ctx.render(s)
      await ctx.wait(900)
      s.voxLanguage = 'English (India)'
      s.voxLanguagesOpen = false
      ctx.render(s)
      await ctx.wait(600)
      const note = buildBaseState({
        screen: 'whatsapp',
        keyboardOpen: true,
        keyboardMode: 'shortcut-form',
        shortcutForm: {
          kind: 'note',
          title: 'Voice note',
          voiceTranscript: 'Bring a spare HDMI cable.',
        },
        featurePill: 'Voice note',
        time: '3:37',
      })
      ctx.render(note)
      await ctx.wait(900)
      await ctx.tap('[data-demo-target="shortcut-save"]')
      ctx.render(this.settledState())
    },
  },

  // F4: Quick Shortcuts
  {
    settledState: () => buildBaseState({
      screen: 'whatsapp',
      keyboardOpen: true,
      keyboardMode: 'shortcut-form',
      shortcutForm: {
        kind: 'alarm',
        title: 'Leave for campus',
        time: 'Today, 2:45 PM',
      },
      toast: 'Alarm set · Today, 2:45 PM',
      featurePill: 'Quick Shortcuts',
      time: '3:38',
    }),
    async play(ctx) {
      const s = buildBaseState({ screen: 'whatsapp', keyboardOpen: true, featurePill: 'Hold m', time: '3:38' })
      ctx.render(s)
      await ctx.wait(220)
      await ctx.hold('[data-demo-target="key-m"]', 520)
      s.keyboardMode = 'shortcuts'
      ctx.render(s)
      await ctx.wait(900)
      await ctx.tap('[data-demo-target="shortcut-alarm"]')
      s.keyboardMode = 'shortcut-form'
      s.shortcutForm = { kind: 'alarm', title: 'Leave for campus', time: 'Today, 2:45 PM' }
      ctx.render(s)
      await ctx.wait(950)
      await ctx.tap('[data-demo-target="shortcut-save"]')
      ctx.render(this.settledState())
    },
  },

  // F5: Quick Capture (crop + pinned note + reopen)
  {
    settledState: () => buildBaseState({
      screen: 'monolog',
      monologTab: 'library',
      libraryDetailId: 'pitch-notice',
      captureCropped: true,
      capturePins: [{ x: 64, y: 52, text: 'Demo Bay B' }],
      savedCapture: clone(CAPTURED_NOTICE),
      featurePill: 'Crop & Pinned note',
      time: '7:48',
    }),
    async play(ctx) {
      const s = buildBaseState({ screen: 'capture', captureNote: CAPTURED_NOTICE.note, time: '7:48', featurePill: 'Quick Capture' })
      ctx.render(s)
      await ctx.wait(500)
      await ctx.tap('[data-demo-target="capture-crop"]')
      s.captureCropped = true
      ctx.render(s)
      await ctx.wait(650)
      await ctx.tap('[data-demo-target="capture-frame"]')
      s.capturePins = [{ x: 64, y: 52, text: 'Demo Bay B' }]
      ctx.render(s)
      await ctx.wait(700)
      await ctx.tap('[data-demo-target="capture-save"]')
      ctx.render(this.settledState())
    },
  },

  // F6: Journal and memory (timeline, source links, edit/pin/delete, monthly recap)
  {
    settledState: () => buildBaseState({
      screen: 'monolog',
      monologTab: 'journal',
      journalPeriod: 'Month',
      journalOpenDay: '2026-11-26',
      savedReminder: clone(SAVED_REMINDER),
      savedCapture: clone(CAPTURED_NOTICE),
      featurePill: 'Monthly recap',
      time: '7:50',
    }),
    async play(ctx) {
      const s = buildBaseState({
        screen: 'monolog',
        monologTab: 'journal',
        journalPeriod: 'Day',
        savedReminder: clone(SAVED_REMINDER),
        savedCapture: clone(CAPTURED_NOTICE),
        featurePill: 'Timeline',
        time: '7:50',
      })
      ctx.render(s)
      await ctx.wait(650)
      await ctx.tap('[data-demo-target="journal-view-day-2026-11-26"]')
      s.journalOpenDay = '2026-11-26'
      s.featurePill = 'Day stream & controls'
      ctx.render(s)
      await ctx.wait(900)
      await ctx.tap('[data-demo-target="journal-period-month"]')
      ctx.render(this.settledState())
    },
  },

  // F7: Privacy and backup
  {
    settledState: () => buildBaseState({
      screen: 'backup',
      featureSubView: 'backup',
      featurePill: 'Drive backup & Setup',
      time: '7:52',
    }),
    async play(ctx) {
      const s = buildBaseState({
        screen: 'protected',
        draftText: '••••••••',
        keyboardOpen: true,
        incognito: 'protected',
        suggestionPill: { kind: 'privacy', icon: 'lock', label: 'Memory paused · Protected' },
        featurePill: 'Protected field',
        time: '7:52',
      })
      ctx.render(s)
      await ctx.wait(1050)
      s.screen = 'notes'
      s.draftText = 'Draft with Memory Off'
      s.incognito = 'memory-off'
      s.suggestionPill = { kind: 'privacy', icon: 'shield', label: 'Memory Off' }
      s.featurePill = 'Memory Off'
      ctx.render(s)
      await ctx.wait(900)
      ctx.render(this.settledState())
    },
  },
]

const storyPoses = [
  'typing', 'reading', 'typing', 'typing', 'vox', 'action', 'reading',
  'vox', 'reading', 'private', 'reading', 'reading', 'action', 'reading',
]

export function initDemoEngine() {
  const screenEl = document.querySelector('#demo-phone-screen')
  const viewportEl = document.querySelector('#phone-viewport')
  const timeEl = document.querySelector('#phone-status-time')
  const touchLayer = document.querySelector('#phone-touch-layer')
  const actionAnnouncement = document.querySelector('#demo-action-announcement')
  const phoneStage = document.querySelector('#demo-phone-stage')
  const phoneControls = document.querySelector('#demo-phone-controls')
  const phoneModel = initPhoneModel(phoneControls, { keyboardRotation: false, presentation: true })

  const progressEl = document.querySelector('#demo-progress')
  const mobileProgressEl = document.querySelector('#demo-nav-progress-mobile')
  const modePillEl = document.querySelector('#demo-mode-pill')
  const titleEl = document.querySelector('#demo-scene-title')
  const captionEl = document.querySelector('#demo-scene-caption')
  const finishActionsEl = document.querySelector('#demo-finish-actions')
  const speakerPanel = document.querySelector('#speaker-notes-panel')
  const speakerDuration = document.querySelector('#speaker-duration')
  const speakerCue = document.querySelector('#speaker-cue-text')
  const stepDotsEl = document.querySelector('#demo-step-dots')

  const prevBtn = document.querySelector('#demo-prev')
  const nextBtn = document.querySelector('#demo-next')
  const restartBtn = document.querySelector('#demo-restart')
  const finishRestartBtn = document.querySelector('#finish-restart')
  const finishBrowseBtn = document.querySelector('#finish-browse')
  const speakerToggleBtn = document.querySelector('#speaker-notes-toggle')
  const scenePickerToggle = document.querySelector('#scene-picker-toggle')
  const scenePickerPanel = document.querySelector('#scene-picker-panel')
  const scenePickerList = document.querySelector('#scene-picker-list')
  const featureBrowserToggle = document.querySelector('#feature-browser-toggle')
  const featureBrowserPanel = document.querySelector('#feature-browser-panel')
  const featureBrowserList = document.querySelector('#feature-browser-list')
  const returnToStoryBtn = document.querySelector('#return-to-story')

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
  let mode = 'story' // 'story' | 'features'
  let index = 0
  let activeRun
  let pendingGesture
  let currentPhoneState
  let capturePlayer
  const animations = new Set()

  function clearPlayback() {
    activeRun?.abort()
    actionAnnouncement.textContent = ''
    capturePlayer?.pause()
    for (const animation of animations) animation.cancel()
    animations.clear()
    touchLayer.replaceChildren()
    viewportEl.querySelector('.is-departing')?.remove()
  }

  function animate(el, frames, duration, onFinish) {
    const animation = el.animate(frames, {
      duration,
      easing: 'cubic-bezier(.2, .7, .26, 1)',
    })
    animations.add(animation)
    animation.onfinish = () => {
      animations.delete(animation)
      onFinish?.()
    }
    return animation
  }

  function renderPhone(state, motion) {
    currentPhoneState = state
    const appearance = phoneControls.dataset.theme
    const keyboardTheme = state.keyboardTheme || appearance
    renderPhoneState(viewportEl, timeEl, { ...state, appearance, keyboardTheme }, motion)
  }

  initPhoneFinish(phoneControls, () => {
    if (currentPhoneState) renderPhone(currentPhoneState)
  })

  function posePhone() {
    phoneModel.followDemo()
    phoneModel.setDemoPose(mode === 'story' ? storyPoses[index] : 'reading')
  }

  function localTarget(selector) {
    const target = viewportEl.querySelector('.phone-screen-stack:not(.is-departing)')?.querySelector(selector)
    if (!target) return null

    // Reveal targets within the phone while keeping the surrounding page still.
    for (let parent = target.parentElement; parent && parent !== viewportEl; parent = parent.parentElement) {
      if (parent.scrollHeight <= parent.clientHeight || !/auto|scroll/.test(getComputedStyle(parent).overflowY)) continue
      const bounds = parent.getBoundingClientRect()
      const rect = target.getBoundingClientRect()
      if (rect.bottom > bounds.bottom - 8) parent.scrollTop += rect.bottom - bounds.bottom + 8
      else if (rect.top < bounds.top + 8) parent.scrollTop += rect.top - bounds.top - 8
    }

    let x = target.offsetWidth / 2
    let y = target.offsetHeight / 2
    for (let node = target; node && node !== screenEl; node = node.offsetParent) {
      x += node.offsetLeft
      y += node.offsetTop
    }
    for (let node = target.parentElement; node && node !== screenEl; node = node.parentElement) {
      x -= node.scrollLeft
      y -= node.scrollTop
    }
    return { x, y, width: target.offsetWidth, height: target.offsetHeight }
  }

  function currentList() {
    return mode === 'story' ? STORY_SCENES : FEATURE_SCENES
  }

  function currentFlows() {
    return mode === 'story' ? STORY_FLOWS : FEATURE_FLOWS
  }

  function formatProgress(idx, total) {
    const pad = n => String(n).padStart(2, '0')
    return mode === 'story' ? `${pad(idx + 1)} / ${pad(total)}` : `F${idx + 1} / ${pad(total)}`
  }

  function updateChrome() {
    const list = currentList()
    const scene = list[index]
    const prog = formatProgress(index, list.length)
    progressEl.textContent = prog
    mobileProgressEl.textContent = prog
    modePillEl.hidden = mode !== 'features'
    phoneStage.dataset.chapter = scene.id
    titleEl.textContent = scene.title
    captionEl.textContent = scene.caption
    speakerDuration.textContent = mode === 'story' ? `~${scene.duration}` : scene.duration
    speakerCue.textContent = scene.cue
    finishActionsEl.hidden = !(mode === 'story' && index === list.length - 1)
    returnToStoryBtn.hidden = mode !== 'features'

    prevBtn.disabled = index === 0
    nextBtn.disabled = index === list.length - 1

    stepDotsEl.replaceChildren(
      ...list.map((item, i) => {
        const dot = document.createElement('button')
        dot.type = 'button'
        dot.className = `step-dot ${i === index ? 'is-active' : ''}`
        dot.setAttribute('aria-label', `Jump to ${item.title}`)
        if (i === index) dot.setAttribute('aria-current', 'step')
        dot.addEventListener('click', () => goTo(mode, i, { animate: false }))
        return dot
      })
    )

    scenePickerList.querySelectorAll('.scene-picker-item').forEach((btn, i) => {
      if (mode === 'story' && i === index) btn.setAttribute('aria-current', 'step')
      else btn.removeAttribute('aria-current')
    })
    featureBrowserList.querySelectorAll('.feature-browser-item').forEach((btn, i) => {
      if (mode === 'features' && i === index) btn.setAttribute('aria-current', 'step')
      else btn.removeAttribute('aria-current')
    })
  }

  function buildPopovers() {
    scenePickerList.innerHTML = STORY_SCENES.map((s, i) => `
      <li>
        <button type="button" class="scene-picker-item" data-jump-story="${i}">
          <span class="scene-picker-num mono">${String(s.number).padStart(2, '0')}</span>
          <span>${s.title}</span>
          <span class="scene-picker-dur mono">${s.duration}</span>
        </button>
      </li>
    `).join('')

    featureBrowserList.innerHTML = FEATURE_SCENES.map((f, i) => `
      <button type="button" class="feature-browser-item" data-jump-feature="${i}">
        <strong>${f.title}</strong>
        <small>${f.caption}</small>
      </button>
    `).join('')
  }

  function closePopovers() {
    scenePickerPanel.hidden = true
    featureBrowserPanel.hidden = true
    scenePickerToggle.setAttribute('aria-expanded', 'false')
    featureBrowserToggle.setAttribute('aria-expanded', 'false')
  }

  function createContext(signal) {
    let origin = null

    function wait(ms, scale = 1.35) {
      signal.throwIfAborted()
      return new Promise((resolve, reject) => {
        const id = setTimeout(() => {
          signal.removeEventListener('abort', cancel)
          resolve()
        }, ms * scale)
        function cancel() {
          clearTimeout(id)
          reject(signal.reason)
        }
        signal.addEventListener('abort', cancel, { once: true })
      })
    }

    function render(state) {
      signal.throwIfAborted()
      renderPhone(state, { animate, origin })
      origin = null
    }

    function placeEffect(position, className, ms, frames) {
      if (!position) return
      const el = document.createElement('span')
      el.className = className
      el.style.left = position.x + 'px'
      el.style.top = position.y + 'px'
      touchLayer.append(el)
      animate(el, frames, ms, () => el.remove())
    }

    async function tap(selector) {
      signal.throwIfAborted()
      origin = localTarget(selector)
      placeEffect(origin, 'touch-ripple', 360, [
        { opacity: .92, transform: 'translate(-50%, -50%) scale(.55)' },
        { opacity: .7, offset: .3 },
        { opacity: 0, transform: 'translate(-50%, -50%) scale(1.65)' },
      ])
      await wait(190)
    }

    async function hold(selector, ms = 780) {
      signal.throwIfAborted()
      const position = localTarget(selector)
      placeEffect(position, 'long-press-ring', ms + 110, [
        { opacity: .65, transform: 'translate(-50%, -50%) scale(.64)' },
        { opacity: 1, transform: 'translate(-50%, -50%) scale(1.08)', offset: .8 },
        { opacity: 0, transform: 'translate(-50%, -50%) scale(1.2)' },
      ])
      await wait(ms, 1)
    }

    async function guide(selector, label, gesture = 'tap') {
      signal.throwIfAborted()
      const target = localTarget(selector)
      if (!target) return

      const guideWidth = Math.min(242, screenEl.clientWidth - 28)
      const left = Math.max(14, Math.min(target.x - guideWidth / 2, screenEl.clientWidth - guideWidth - 14))
      const above = target.y > 116
      const note = document.createElement('div')
      note.className = above ? 'phone-gesture-cue cue-above' : 'phone-gesture-cue'
      note.style.left = left + 'px'
      note.style.width = guideWidth + 'px'
      note.style.top = target.y + (above ? -1 : 1) * (target.height / 2 + 13) + 'px'
      note.style.setProperty('--cue-pointer', Math.max(12, Math.min(target.x - left, guideWidth - 12)) + 'px')
      const instruction = document.createElement('strong')
      instruction.textContent = label
      const shortcut = document.createElement('small')
      shortcut.textContent = 'Space to perform now'
      note.append(instruction, shortcut)
      touchLayer.append(note)
      actionAnnouncement.textContent = label + '. Press Space to perform now.'

      try {
        await new Promise((resolve, reject) => {
          const timer = setTimeout(proceed, 2750)
          function proceed() {
            clearTimeout(timer)
            signal.removeEventListener('abort', cancel)
            pendingGesture = undefined
            resolve()
          }
          function cancel() {
            clearTimeout(timer)
            pendingGesture = undefined
            reject(signal.reason)
          }
          signal.addEventListener('abort', cancel, { once: true })
          pendingGesture = { selector, proceed }
        })
      } finally {
        note.remove()
      }
      if (gesture === 'hold') await hold(selector, 920)
      else await tap(selector)
      actionAnnouncement.textContent = ''
    }

    async function swipeHome() {
      signal.throwIfAborted()
      placeEffect(localTarget('.android-gesture-bar'), 'home-swipe-cue', 320, [
        { opacity: .9, transform: 'translate(-50%, -50%)' },
        { opacity: .7, offset: .65 },
        { opacity: 0, transform: 'translate(-50%, -65px)' },
      ])
      await wait(280)
    }

    function flash() {
      signal.throwIfAborted()
      const el = document.createElement('span')
      el.className = 'capture-flash'
      touchLayer.append(el)
      animate(el, [{ opacity: 0 }, { opacity: .82, offset: .22 }, { opacity: 0 }], 280, () => el.remove())
    }

    async function typeInto(state, field, text, charMs = 28, append = false) {
      signal.throwIfAborted()
      let current = append ? state[field] || '' : ''
      const voiceDraft = state.screen === 'whatsapp' && field === 'voxTranscript'
      const showKeys = ['draftText', 'noteTitle', 'noteBody'].includes(field)
      for (const ch of text) {
        current += ch
        state[field] = current
        const lower = ch.toLowerCase()
        updatePhoneTyping(viewportEl, field, current, showKeys && /^[a-z]$/.test(lower) ? lower : '')
        if (voiceDraft) {
          state.draftText = current
          updatePhoneTyping(viewportEl, 'draftText', current)
        }
        await wait(ch === ' ' ? charMs * 1.45 : charMs)
      }
      render(state)
    }

    return { render, wait, tap, hold, guide, typeInto, swipeHome, flash }
  }

  async function goTo(nextMode, nextIndex, { animate: shouldAnimate = true } = {}) {
    const targetList = nextMode === 'story' ? STORY_SCENES : FEATURE_SCENES
    const clamped = Math.max(0, Math.min(targetList.length - 1, nextIndex))

    clearPlayback()
    const run = new AbortController()
    activeRun = run
    mode = nextMode
    index = clamped
    updateChrome()
    posePhone()

    const flow = currentFlows()[index]
    if (!shouldAnimate || reducedMotion.matches) {
      renderPhone(flow.settledState())
      return
    }

    try {
      await flow.play(createContext(run.signal))
    } catch (error) {
      if (!run.signal.aborted) throw error
    }
  }

  function next() {
    const list = currentList()
    if (index >= list.length - 1) return
    goTo(mode, index + 1, { animate: true })
  }

  function prev() {
    if (index <= 0) return
    goTo(mode, index - 1, { animate: false })
  }

  function restart() {
    closePopovers()
    goTo('story', 0, { animate: false })
  }

  buildPopovers()

  reducedMotion.addEventListener('change', () => goTo(mode, index, { animate: false }))

  viewportEl.addEventListener('click', event => {
    if (pendingGesture && event.target.closest(pendingGesture.selector)) {
      pendingGesture.proceed()
      return
    }
    const target = event.target.closest('[data-demo-target]')
    const control = target?.dataset.demoTarget
    const state = currentPhoneState

    if (control === 'capture-audio' && state.savedCapture?.audioPath) {
      if (!capturePlayer) {
        capturePlayer = new Audio(state.savedCapture.audioPath)
        const reflectPlayback = () => {
          const button = viewportEl.querySelector('[data-demo-target="capture-audio"]')
          const playing = !capturePlayer.paused
          button?.setAttribute('aria-pressed', String(playing))
          button?.setAttribute('aria-label', playing ? 'Pause voice note' : 'Play voice note')
        }
        for (const type of ['play', 'pause', 'ended']) capturePlayer.addEventListener(type, reflectPlayback)
      }
      if (capturePlayer.paused) {
        if (capturePlayer.ended) capturePlayer.currentTime = 0
        capturePlayer.play().catch(() => capturePlayer.pause())
      }
      else capturePlayer.pause()
      return
    }
    if (control?.startsWith('library-filter-')) {
      const filter = ['All', 'Photos', 'Screenshots', 'Voice'].find(label => control === 'library-filter-' + label.toLowerCase())
      clearPlayback()
      renderPhone({ ...state, libraryFilter: filter })
      viewportEl.querySelector('[data-demo-target="' + control + '"]')?.focus()
      return
    }
    if (['tab-today', 'tab-journal', 'tab-library'].includes(control)) {
      clearPlayback()
      renderPhone({ ...state, monologTab: control.slice(4), libraryDetailId: null, screenshotOpen: false, toast: null })
      viewportEl.querySelector('[data-demo-target="' + control + '"]')?.focus()
      return
    }
    if (!['journal-source-card', 'library-back', 'capture-preview', 'capture-preview-close', 'library-pitch-card', 'library-shopping-card'].includes(control)) return

    clearPlayback()
    if (control === 'journal-source-card' && state.journalAnswer) {
      renderPhone({ ...state, monologTab: 'library', libraryDetailId: state.journalAnswer.sourceId })
      viewportEl.querySelector('[data-demo-target="library-back"]')?.focus()
    } else if (control === 'capture-preview' || control === 'capture-preview-close') {
      const opening = control === 'capture-preview'
      renderPhone({ ...state, screenshotOpen: opening })
      viewportEl.querySelector(opening ? '[data-demo-target="capture-preview-close"]' : '[data-demo-target="capture-preview"]')?.focus()
    } else if (control === 'library-pitch-card' || control === 'library-shopping-card') {
      const capture = control === 'library-shopping-card' ? state.savedShopping : state.savedCapture
      if (!capture) return
      renderPhone({ ...state, libraryDetailId: capture.id })
      viewportEl.querySelector('[data-demo-target="library-back"]')?.focus()
    } else if (control === 'library-back') {
      const fromJournal = currentFlows()[index].settledState().monologTab === 'journal'
      const previousCard = state.libraryDetailId === SHOPPING_CAPTURE.id ? 'library-shopping-card' : 'library-pitch-card'
      renderPhone({ ...state, monologTab: fromJournal ? 'journal' : 'library', libraryDetailId: null, screenshotOpen: false, toast: null })
      viewportEl.querySelector('[data-demo-target="' + (fromJournal ? 'journal-source-card' : previousCard) + '"]')?.focus()
    }
  })

  prevBtn.addEventListener('click', prev)
  nextBtn.addEventListener('click', next)
  restartBtn.addEventListener('click', restart)
  finishRestartBtn.addEventListener('click', restart)
  finishBrowseBtn.addEventListener('click', () => {
    closePopovers()
    featureBrowserPanel.hidden = false
    featureBrowserToggle.setAttribute('aria-expanded', 'true')
    featureBrowserPanel.querySelector('button')?.focus()
  })

  speakerToggleBtn.addEventListener('click', () => {
    const nextOpen = speakerPanel.hidden
    speakerPanel.hidden = !nextOpen
    speakerToggleBtn.setAttribute('aria-pressed', String(nextOpen))
  })

  scenePickerToggle.addEventListener('click', () => {
    const open = scenePickerPanel.hidden
    closePopovers()
    if (open) {
      scenePickerPanel.hidden = false
      scenePickerToggle.setAttribute('aria-expanded', 'true')
    }
  })

  featureBrowserToggle.addEventListener('click', () => {
    const open = featureBrowserPanel.hidden
    closePopovers()
    if (open) {
      featureBrowserPanel.hidden = false
      featureBrowserToggle.setAttribute('aria-expanded', 'true')
    }
  })

  document.querySelectorAll('[data-close-popover]').forEach(btn => {
    btn.addEventListener('click', closePopovers)
  })

  scenePickerList.addEventListener('click', event => {
    const btn = event.target.closest('[data-jump-story]')
    if (!btn) return
    closePopovers()
    goTo('story', Number(btn.dataset.jumpStory))
  })

  featureBrowserList.addEventListener('click', event => {
    const btn = event.target.closest('[data-jump-feature]')
    if (!btn) return
    closePopovers()
    goTo('features', Number(btn.dataset.jumpFeature), { animate: true })
  })

  returnToStoryBtn.addEventListener('click', () => {
    closePopovers()
    goTo('story', 0, { animate: false })
  })

  document.addEventListener('click', event => {
    if (!event.target.closest('.demo-popover, #scene-picker-toggle, #feature-browser-toggle, #finish-browse')) {
      closePopovers()
    }
  })

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (currentPhoneState?.screenshotOpen) {
        viewportEl.querySelector('[data-demo-target="capture-preview-close"]')?.click()
        return
      }
      if (!scenePickerPanel.hidden || !featureBrowserPanel.hidden) {
        closePopovers()
        return
      }
    }
    if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return
    if (event.code === 'Space' && pendingGesture) {
      event.preventDefault()
      pendingGesture.proceed()
      return
    }
    const tag = document.activeElement?.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      next()
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      prev()
    }
  })

  goTo('story', 0, { animate: false })
}

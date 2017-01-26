declare namespace nodegit {
    const enum SuccessOrFailure {
        SUCCESS = 0,
        FAIL = -1
    }
    const enum Attr_STATES {
        UNSPECIFIED_T = 0,
        TRUE_T = 1,
        FALSE_T = 2,
        VALUE_T = 3,
    }
    const enum Blame_FLAG {
        NORMAL = 0,
        TRACK_COPIES_SAME_FILE = 1,
        TRACK_COPIES_SAME_COMMIT_MOVES = 2,
        TRACK_COPIES_SAME_COMMIT_COPIES = 4,
        TRACK_COPIES_ANY_COMMIT_COPIES = 8,
        FIRST_PARENT = 16,
    }
    const enum Branch_BRANCH {
        LOCAL = 1,
        REMOTE = 2,
        ALL = 3,
    }
    const enum Cert_SSH {
        MD5 = 1,
        SHA1 = 2,
    }
    const enum Cert_TYPE {
        NONE = 0,
        X509 = 1,
        HOSTKEY_LIBSSH2 = 2,
        STRARRAY = 3,
    }
    const enum Checkout_NOTIFY {
        NONE = 0,
        CONFLICT = 1,
        DIRTY = 2,
        UPDATED = 4,
        UNTRACKED = 8,
        IGNORED = 16,
        ALL = 65535,
    }
    const enum Checkout_STRATEGY {
        NONE = 0,
        SAFE = 1,
        FORCE = 2,
        RECREATE_MISSING = 4,
        ALLOW_CONFLICTS = 16,
        REMOVE_UNTRACKED = 32,
        REMOVE_IGNORED = 64,
        UPDATE_ONLY = 128,
        DONT_UPDATE_INDEX = 256,
        NO_REFRESH = 512,
        SKIP_UNMERGED = 1024,
        USE_OURS = 2048,
        USE_THEIRS = 4096,
        DISABLE_PATHSPEC_MATCH = 8192,
        SKIP_LOCKED_DIRECTORIES = 262144,
        DONT_OVERWRITE_IGNORED = 524288,
        CONFLICT_STYLE_MERGE = 1048576,
        CONFLICT_STYLE_DIFF3 = 2097152,
        DONT_REMOVE_EXISTING = 4194304,
        DONT_WRITE_INDEX = 8388608,
        UPDATE_SUBMODULES = 65536,
        UPDATE_SUBMODULES_IF_CHANGED = 131072,
    }
    const enum Clone_LOCAL {
        AUTO = 0,
        LOCAL = 1,
        NO_LOCAL = 2,
        NO_LINKS = 3,
    }
    const enum Config_LEVEL {
        PROGRAMDATA = 1,
        SYSTEM = 2,
        XDG = 3,
        GLOBAL = 4,
        LOCAL = 5,
        APP = 6,
        HIGHEST_LEVEL = -1,
    }
    const enum Cred_TYPE {
        USERPASS_PLAINTEXT = 1,
        SSH_KEY = 2,
        SSH_CUSTOM = 4,
        DEFAULT = 8,
        SSH_INTERACTIVE = 16,
        USERNAME = 32,
        SSH_MEMORY = 64,
    }
    const enum Diff_DELTA {
        UNMODIFIED = 0,
        ADDED = 1,
        DELETED = 2,
        MODIFIED = 3,
        RENAMED = 4,
        COPIED = 5,
        IGNORED = 6,
        UNTRACKED = 7,
        TYPECHANGE = 8,
        UNREADABLE = 9,
        CONFLICTED = 10,
    }
    const enum Diff_FIND {
        BY_CONFIG = 0,
        RENAMES = 1,
        RENAMES_FROM_REWRITES = 2,
        COPIES = 4,
        COPIES_FROM_UNMODIFIED = 8,
        REWRITES = 16,
        BREAK_REWRITES = 32,
        AND_BREAK_REWRITES = 48,
        FOR_UNTRACKED = 64,
        ALL = 255,
        IGNORE_LEADING_WHITESPACE = 0,
        IGNORE_WHITESPACE = 4096,
        DONT_IGNORE_WHITESPACE = 8192,
        EXACT_MATCH_ONLY = 16384,
        BREAK_REWRITES_FOR_RENAMES_ONLY = 32768,
        REMOVE_UNMODIFIED = 65536,
    }
    const enum Diff_FLAG {
        BINARY = 1,
        NOT_BINARY = 2,
        VALID_ID = 4,
        EXISTS = 8,
    }
    const enum Diff_FORMAT {
        PATCH = 1,
        PATCH_HEADER = 2,
        RAW = 3,
        NAME_ONLY = 4,
        NAME_STATUS = 5,
    }
    const enum Diff_FORMAT_EMAIL_FLAGS {
        FORMAT_EMAIL_NONE = 0,
        FORMAT_EMAIL_EXCLUDE_SUBJECT_PATCH_MARKER = 1,
    }
    const enum Diff_LINE {
        CONTEXT = 32,
        ADDITION = 43,
        DELETION = 45,
        CONTEXT_EOFNL = 61,
        ADD_EOFNL = 62,
        DEL_EOFNL = 60,
        FILE_HDR = 70,
        HUNK_HDR = 72,
        BINARY = 66,
    }
    const enum Diff_OPTION {
        NORMAL = 0,
        REVERSE = 1,
        INCLUDE_IGNORED = 2,
        RECURSE_IGNORED_DIRS = 4,
        INCLUDE_UNTRACKED = 8,
        RECURSE_UNTRACKED_DIRS = 16,
        INCLUDE_UNMODIFIED = 32,
        INCLUDE_TYPECHANGE = 64,
        INCLUDE_TYPECHANGE_TREES = 128,
        IGNORE_FILEMODE = 256,
        IGNORE_SUBMODULES = 512,
        IGNORE_CASE = 1024,
        INCLUDE_CASECHANGE = 2048,
        DISABLE_PATHSPEC_MATCH = 4096,
        SKIP_BINARY_CHECK = 8192,
        ENABLE_FAST_UNTRACKED_DIRS = 16384,
        UPDATE_INDEX = 32768,
        INCLUDE_UNREADABLE = 65536,
        INCLUDE_UNREADABLE_AS_UNTRACKED = 131072,
        FORCE_TEXT = 1048576,
        FORCE_BINARY = 2097152,
        IGNORE_WHITESPACE = 4194304,
        IGNORE_WHITESPACE_CHANGE = 8388608,
        IGNORE_WHITESPACE_EOL = 16777216,
        SHOW_UNTRACKED_CONTENT = 33554432,
        SHOW_UNMODIFIED = 67108864,
        PATIENCE = 268435456,
        MINIMAL = 536870912,
        SHOW_BINARY = 1073741824,
    }
    const enum Diff_STATS_FORMAT {
        STATS_NONE = 0,
        STATS_FULL = 1,
        STATS_SHORT = 2,
        STATS_NUMBER = 4,
        STATS_INCLUDE_SUMMARY = 8,
    }
    const enum DiffBinary_DIFF_BINARY {
        NONE = 0,
        LITERAL = 1,
        DELTA = 2,
    }
    const enum Enums_CVAR {
        FALSE = 0,
        TRUE = 1,
        INT32 = 2,
        STRING = 3,
    }
    const enum Enums_DIRECTION {
        FETCH = 0,
        PUSH = 1,
    }
    const enum Enums_FEATURE {
        THREADS = 1,
        HTTPS = 2,
        SSH = 4,
        NSEC = 8,
    }
    const enum Enums_IDXENTRY_EXTENDED_FLAG {
        IDXENTRY_INTENT_TO_ADD = 8192,
        IDXENTRY_SKIP_WORKTREE = 16384,
        IDXENTRY_EXTENDED2 = 32768,
        S = 24576,
        IDXENTRY_UPDATE = 1,
        IDXENTRY_REMOVE = 2,
        IDXENTRY_UPTODATE = 4,
        IDXENTRY_ADDED = 8,
        IDXENTRY_HASHED = 16,
        IDXENTRY_UNHASHED = 32,
        IDXENTRY_WT_REMOVE = 64,
        IDXENTRY_CONFLICTED = 128,
        IDXENTRY_UNPACKED = 256,
        IDXENTRY_NEW_SKIP_WORKTREE = 512,
    }
    const enum Enums_INDXENTRY_FLAG {
        IDXENTRY_EXTENDED = 16384,
        IDXENTRY_VALID = 32768,
    }
    const enum Error_CODE {
        OK = 0,
        ERROR = -1,
        ENOTFOUND = -3,
        EEXISTS = -4,
        EAMBIGUOUS = -5,
        EBUFS = -6,
        EUSER = -7,
        EBAREREPO = -8,
        EUNBORNBRANCH = -9,
        EUNMERGED = -10,
        ENONFASTFORWARD = -11,
        EINVALIDSPEC = -12,
        ECONFLICT = -13,
        ELOCKED = -14,
        EMODIFIED = -15,
        EAUTH = -16,
        ECERTIFICATE = -17,
        EAPPLIED = -18,
        EPEEL = -19,
        EEOF = -20,
        EINVALID = -21,
        EUNCOMMITTED = -22,
        EDIRECTORY = -23,
        EMERGECONFLICT = -24,
        PASSTHROUGH = -30,
        ITEROVER = -31,
    }
    const enum Error_ERROR {
        GITERR_NONE = 0,
        GITERR_NOMEMORY = 1,
        GITERR_OS = 2,
        GITERR_INVALID = 3,
        GITERR_REFERENCE = 4,
        GITERR_ZLIB = 5,
        GITERR_REPOSITORY = 6,
        GITERR_CONFIG = 7,
        GITERR_REGEX = 8,
        GITERR_ODB = 9,
        GITERR_INDEX = 10,
        GITERR_OBJECT = 11,
        GITERR_NET = 12,
        GITERR_TAG = 13,
        GITERR_TREE = 14,
        GITERR_INDEXER = 15,
        GITERR_SSL = 16,
        GITERR_SUBMODULE = 17,
        GITERR_THREAD = 18,
        GITERR_STASH = 19,
        GITERR_CHECKOUT = 20,
        GITERR_FETCHHEAD = 21,
        GITERR_MERGE = 22,
        GITERR_SSH = 23,
        GITERR_FILTER = 24,
        GITERR_REVERT = 25,
        GITERR_CALLBACK = 26,
        GITERR_CHERRYPICK = 27,
        GITERR_DESCRIBE = 28,
        GITERR_REBASE = 29,
        GITERR_FILESYSTEM = 30,
    }
    const enum Fetch_PRUNE {
        GIT_FETCH_PRUNE_UNSPECIFIED = 0,
        GIT_FETCH_PRUNE = 1,
        GIT_FETCH_NO_PRUNE = 2,
    }
    const enum Filter_FLAG {
        DEFAULT = 0,
        ALLOW_UNSAFE = 1,
    }
    const enum Filter_MODE {
        TO_WORKTREE = 0,
        SMUDGE = 0,
        TO_ODB = 1,
        CLEAN = 1,
    }
    const enum Hashsig_OPTION {
        NORMAL = 0,
        IGNORE_WHITESPACE = 1,
        SMART_WHITESPACE = 2,
        ALLOW_SMALL_FILES = 4,
    }
    const enum Libgit2_OPT {
        GET_MWINDOW_SIZE = 0,
        SET_MWINDOW_SIZE = 1,
        GET_MWINDOW_MAPPED_LIMIT = 2,
        SET_MWINDOW_MAPPED_LIMIT = 3,
        GET_SEARCH_PATH = 4,
        SET_SEARCH_PATH = 5,
        SET_CACHE_OBJECT_LIMIT = 6,
        SET_CACHE_MAX_SIZE = 7,
        ENABLE_CACHING = 8,
        GET_CACHED_MEMORY = 9,
        GET_TEMPLATE_PATH = 10,
        SET_TEMPLATE_PATH = 11,
        SET_SSL_CERT_LOCATIONS = 12,
        SET_USER_AGENT = 13,
        ENABLE_STRICT_OBJECT_CREATION = 14,
        SET_SSL_CIPHERS = 15,
    }
    const enum Merge_ANALYSIS {
        NONE = 0,
        NORMAL = 1,
        UP_TO_DATE = 2,
        FASTFORWARD = 4,
        UNBORN = 8,
    }
    const enum Merge_FILE_FAVOR {
        NORMAL = 0,
        OURS = 1,
        THEIRS = 2,
        UNION = 3,
    }
    const enum Merge_FILE_FLAG {
        FILE_DEFAULT = 0,
        FILE_STYLE_MERGE = 1,
        FILE_STYLE_DIFF3 = 2,
        FILE_SIMPLIFY_ALNUM = 4,
        FILE_IGNORE_WHITESPACE = 8,
        FILE_IGNORE_WHITESPACE_CHANGE = 16,
        FILE_IGNORE_WHITESPACE_EOL = 32,
        FILE_DIFF_PATIENCE = 64,
        FILE_DIFF_MINIMAL = 128,
    }
    const enum Merge_FLAG {
        FIND_RENAMES = 1,
        FAIL_ON_CONFLICT = 2,
        SKIP_REUC = 4,
        NO_RECURSIVE = 8,
    }
    const enum Merge_PREFERENCE {
        NONE = 0,
        NO_FASTFORWARD = 1,
        FASTFORWARD_ONLY = 2,
    }
    const enum Index_ADD_OPTION {
        ADD_DEFAULT = 0,
        ADD_FORCE = 1,
        ADD_DISABLE_PATHSPEC_MATCH = 2,
        ADD_CHECK_PATHSPEC = 4,
    }
    const enum Index_CAP {
        IGNORE_CASE = 1,
        NO_FILEMODE = 2,
        NO_SYMLINKS = 4,
        FROM_OWNER = -1,
    }
    const enum Object_TYPE {
        ANY = -2,
        BAD = -1,
        EXT1 = 0,
        COMMIT = 1,
        TREE = 2,
        BLOB = 3,
        TAG = 4,
        EXT2 = 5,
        OFS_DELTA = 6,
        REF_DELTA = 7,
    }
    const enum Odb_STREAM {
        RDONLY = 2,
        WRONLY = 4,
        RW = 6,
    }
    const enum Packbuilder_STAGE {
        ADDING_OBJECTS = 0,
        DELTAFICATION = 1,
    }
    const enum Pathspec_FLAG {
        DEFAULT = 0,
        IGNORE_CASE = 1,
        USE_CASE = 2,
        NO_GLOB = 4,
        NO_MATCH_ERROR = 8,
        FIND_FAILURES = 16,
        FAILURES_ONLY = 32,
    }
    const enum Proxy_PROXY {
        NONE = 0,
        AUTO = 1,
        SPECIFIED = 2,
    }
    const enum RebaseOperation_REBASE_OPERATION {
        PICK = 0,
        REWORD = 1,
        EDIT = 2,
        SQUASH = 3,
        FIXUP = 4,
        EXEC = 5,
    }
    const enum Reset_TYPE {
        SOFT = 1,
        MIXED = 2,
        HARD = 3,
    }
    const enum Reference_NORMALIZE {
        REF_FORMAT_NORMAL = 0,
        REF_FORMAT_ALLOW_ONELEVEL = 1,
        REF_FORMAT_REFSPEC_PATTERN = 2,
        REF_FORMAT_REFSPEC_SHORTHAND = 4,
    }
    const enum Reference_TYPE {
        INVALID = 0,
        OID = 1,
        SYMBOLIC = 2,
        LISTALL = 3,
    }
    const enum Revparse_MODE {
        SINGLE = 1,
        RANGE = 2,
        MERGE_BASE = 4,
    }
    const enum Revwalk_SORT {
        NONE = 0,
        TOPOLOGICAL = 1,
        TIME = 2,
        REVERSE = 4,
    }
    const enum Remote_AUTOTAG_OPTION {
        DOWNLOAD_TAGS_UNSPECIFIED = 0,
        DOWNLOAD_TAGS_AUTO = 1,
        DOWNLOAD_TAGS_NONE = 2,
        DOWNLOAD_TAGS_ALL = 3,
    }
    const enum Remote_COMPLETION_TYPE {
        COMPLETION_DOWNLOAD = 0,
        COMPLETION_INDEXING = 1,
        COMPLETION_ERROR = 2,
    }
    const enum Stash_APPLY_FLAGS {
        APPLY_DEFAULT = 0,
        APPLY_REINSTATE_INDEX = 1,
    }
    const enum Stash_APPLY_PROGRESS {
        NONE = 0,
        LOADING_STASH = 1,
        ANALYZE_INDEX = 2,
        ANALYZE_MODIFIED = 3,
        ANALYZE_UNTRACKED = 4,
        CHECKOUT_UNTRACKED = 5,
        CHECKOUT_MODIFIED = 6,
        DONE = 7,
    }
    const enum Stash_FLAGS {
        DEFAULT = 0,
        KEEP_INDEX = 1,
        INCLUDE_UNTRACKED = 2,
        INCLUDE_IGNORED = 4,
    }
    const enum Status_OPT {
        INCLUDE_UNTRACKED = 1,
        INCLUDE_IGNORED = 2,
        INCLUDE_UNMODIFIED = 4,
        EXCLUDE_SUBMODULES = 8,
        RECURSE_UNTRACKED_DIRS = 16,
        DISABLE_PATHSPEC_MATCH = 32,
        RECURSE_IGNORED_DIRS = 64,
        RENAMES_HEAD_TO_INDEX = 128,
        RENAMES_INDEX_TO_WORKDIR = 256,
        SORT_CASE_SENSITIVELY = 512,
        SORT_CASE_INSENSITIVELY = 1024,
        RENAMES_FROM_REWRITES = 2048,
        NO_REFRESH = 4096,
        UPDATE_INDEX = 8192,
        INCLUDE_UNREADABLE = 16384,
        INCLUDE_UNREADABLE_AS_UNTRACKED = 32768,
    }
    const enum Status_SHOW {
        INDEX_AND_WORKDIR = 0,
        INDEX_ONLY = 1,
        WORKDIR_ONLY = 2,
    }
    const enum Status_STATUS {
        CURRENT = 0,
        INDEX_NEW = 1,
        INDEX_MODIFIED = 2,
        INDEX_DELETED = 4,
        INDEX_RENAMED = 8,
        INDEX_TYPECHANGE = 16,
        WT_NEW = 128,
        WT_MODIFIED = 256,
        WT_DELETED = 512,
        WT_TYPECHANGE = 1024,
        WT_RENAMED = 2048,
        WT_UNREADABLE = 4096,
        IGNORED = 16384,
        CONFLICTED = 32768,
    }
    const enum Repository_INIT_FLAG {
        BARE = 1,
        NO_REINIT = 2,
        NO_DOTGIT_DIR = 4,
        MKDIR = 8,
        MKPATH = 16,
        EXTERNAL_TEMPLATE = 32,
        RELATIVE_GITLINK = 64,
    }
    const enum Repository_INIT_MODE {
        INIT_SHARED_UMASK = 0,
        INIT_SHARED_GROUP = 1533,
        INIT_SHARED_ALL = 1535,
    }
    const enum Repository_OPEN_FLAG {
        OPEN_NO_SEARCH = 1,
        OPEN_CROSS_FS = 2,
        OPEN_BARE = 4,
    }
    const enum Repository_STATE {
        NONE = 0,
        MERGE = 1,
        REVERT = 2,
        REVERT_SEQUENCE = 3,
        CHERRYPICK = 4,
        CHERRYPICK_SEQUENCE = 5,
        BISECT = 6,
        REBASE = 7,
        REBASE_INTERACTIVE = 8,
        REBASE_MERGE = 9,
        APPLY_MAILBOX = 10,
        APPLY_MAILBOX_OR_REBASE = 11,
    }
    const enum Trace_LEVEL {
        NONE = 0,
        FATAL = 1,
        ERROR = 2,
        WARN = 3,
        INFO = 4,
        DEBUG = 5,
        TRACE = 6,
    }
    const enum Transport_FLAGS {
        NONE = 0,
    }
    const enum Tree_WALK_MODE {
        WALK_PRE = 0,
        WALK_POST = 1,
    }
    const enum TreeEntry_FILEMODE {
        UNREADABLE = 0,
        TREE = 16384,
        BLOB = 33188,
        EXECUTABLE = 33261,
        LINK = 40960,
        COMMIT = 57344,
    }
    const enum Submodule_IGNORE {
        UNSPECIFIED = -1,
        NONE = 1,
        UNTRACKED = 2,
        DIRTY = 3,
        ALL = 4,
    }
    const enum Submodule_RECURSE {
        NO = 0,
        YES = 1,
        ONDEMAND = 2,
    }
    const enum Submodule_STATUS {
        IN_HEAD = 1,
        IN_INDEX = 2,
        IN_CONFIG = 4,
        IN_WD = 8,
        INDEX_ADDED = 16,
        INDEX_DELETED = 32,
        INDEX_MODIFIED = 64,
        WD_UNINITIALIZED = 128,
        WD_ADDED = 256,
        WD_DELETED = 512,
        WD_MODIFIED = 1024,
        WD_INDEX_MODIFIED = 2048,
        WD_WD_MODIFIED = 4096,
        WD_UNTRACKED = 8192,
    }
    const enum Submodule_UPDATE {
        CHECKOUT = 1,
        REBASE = 2,
        MERGE = 3,
        NONE = 4,
        DEFAULT = 0,
    }

    class AnnotatedCommit {
        public static fromFetchhead(repo: Repository, branch_name: string, remote_url: string, id: Oid): Promise<AnnotatedCommit>;
        public static fromRef(repo: Repository, ref: Reference): Promise<AnnotatedCommit>;
        public static fromRevspec(repo: Repository, revspec: string): Promise<AnnotatedCommit>;
        public static lookup(repo: Repository, id: Oid): Promise<AnnotatedCommit>;
        public free(): void;
        public id(): Oid;
    }

    class Attr {
        public static addMacro(repo: Repository, name: string, values: string): number;
        public static cacheFlush(repo: Repository): void;
        public static get(repo: Repository, flags: number, path: string, name: string): Promise<string>;
        public static getMany(repo: Repository, flags: number, path: string, num_attr: number, names: string): any[];
        public static value(attr: string): number;
        public static STATES: typeof Attr_STATES;
    }

    class Blame {
        public static file(repo: Repository, path: string, options: BlameOptions): void;
        public static initOptions(opts: BlameOptions, version: number): SuccessOrFailure;
        public buffer(buffer: string, buffer_len: number): Promise<Blame>;
        public free(): void;
        public getHunkByIndex(index: number): BlameHunk | null;
        public getHunkByLine(lineno: number): BlameHunk | null;
        public getHunkCount(): number;
        public static FLAG: typeof Blame_FLAG;
    }

    interface BlameHunk {
        finalCommitId: Oid;
        finalSignature: Signature;
        finalStartLineNumber: number;
        linesInHunk: number;
        origCommitId: Oid;
        origPath: string;
        origSignature: Signature;
        origStartLineNumber: number;
    }

    interface BlameOptions {
        flags: number;
        maxLine: number;
        minLine: number;
        minMatchCharacters: number;
        newestCommit: Oid;
        oldestCommit: Oid;
        version: number;
    }

    class Blob {
        public static createFromBuffer(repo: Repository, buffer: Buffer, len: number): Oid;
        public static createFromDisk(id: Oid, repo: Repository, path: string): number;
        public static createFromStream(repo: Repository, hintpath: string): Promise<Writestream>;
        public static createFromWorkdir(id: Oid, repo: Repository, relative_path: string): number;
        public static createFromstreamCommit(stream: Writestream): Promise<Oid>;
        public static lookup(repo: Repository, id: string | Oid, Blob): Promise<Blob>;
        public static lookupPrefix(repo: Repository, id: Oid, len: number): Promise<Blob>;
        public content(): Buffer;
        public dup(): Promise<Blob>;
        public filemode(): number;
        public free(): void;
        public id(): Oid;
        public isBinary(): number;
        public owner(): Repository;
        public rawcontent(): Buffer;
        public rawsize(): number;
        public toString(): string;
    }

    class Branch {
        public static create(repo: Repository, branch_name: string, target: Commit, force: number): Promise<Reference>;
        public static createFromAnnotated(repository: Repository, branch_name: string, commit: AnnotatedCommit, force: number): Reference;
        public static delete(branch: Reference): number;
        public static isHead(branch: Reference): number;
        public static iteratorNew(repo: Repository, list_flags: Branch_BRANCH): Promise<BranchIterator>;
        public static lookup(repo: Repository, branch_name: string, branch_type: Branch_BRANCH): Promise<Reference>;
        public static move(branch: Reference, new_branch_name: string, force: number): Promise<Reference>;
        public static name(ref: Reference): Promise<string>;
        public static setUpstream(branch: Reference, upstream_name: string): Promise<number>;
        public static upstream(branch: Reference): Promise<Reference>;
        public static BRANCH: typeof Branch_BRANCH;
    }

    class Buf {
        public containsNul(): number;
        public free(): void;
        public grow(target_size: number): Buf;
        public isBinary(): number;
        public set(data: Buffer, datalen: number): Buf;
    }

    interface Cert {
        SSH: Cert_SSH;
        TYPE: Cert_TYPE;
        certType: number;
    }

    interface CertHostkey {
        hashMd5: string;
        hashSha1: string;
        parent: Cert;
        type: number;
    }

    interface CertX509 {
        data: Buffer;
        len: number;
        parent: Cert;
    }

    class Checkout {
        public static head(repo: Repository, options: CheckoutOptions): void;
        public static index(repo: Repository, The: Index, options: CheckoutOptions): void;
        public static initOptions(opts: CheckoutOptions, version: number): SuccessOrFailure;
        public static tree(repo: Repository, treeish: Oid, Tree, Commit, Reference, options: CheckoutOptions): void;
        public static NOTIFY: typeof Checkout_NOTIFY;
        public static STRATEGY: typeof Checkout_STRATEGY;
    }

    interface CheckoutOptions {
        ancestorLabel: string;
        baseline: Tree;
        baselineIndex: Index;
        checkoutStrategy: number;
        dirMode: number;
        disableFilters: number;
        fileMode: number;
        fileOpenFlags: number;
        notifyCb: CheckoutNotifyCb;
        notifyFlags: number;
        notifyPayload: Void;
        ourLabel: string;
        paths: Strarray;
        perfdataCb: CheckoutPerfdataCb;
        perfdataPayload: Void;
        progressCb: CheckoutProgressCb;
        progressPayload: Void;
        targetDirectory: string;
        theirLabel: string;
        version: number;
    }

    class Cherrypick {
        public static cherrypick(repo: Repository, commit: Commit, options: CherrypickOptions): Promise<SuccessOrFailure>;
        public static commit(repo: Repository, cherrypick_commit: Commit, our_commit: Commit, mainline: int, merge_options: MergeOptions): Promise<SuccessOrFailure>;
        public static initOptions(opts: CherrypickOptions, version: number): SuccessOrFailure;
    }

    interface CherrypickOptions {
        checkoutOpts: CheckoutOptions;
        mainline: number;
        mergeOpts: MergeOptions;
        version: number;
    }

    class Clone {
        public static clone(url: string, local_path: string, options: CloneOptions): Promise<Repository>;
        public static initOptions(opts: CloneOptions, version: number): SuccessOrFailure;
        public static LOCAL: typeof Clone_LOCAL;
    }

    interface CloneOptions {
        bare: number;
        checkoutBranch: string;
        checkoutOpts: CheckoutOptions;
        fetchOpts: FetchOptions;
        local: number;
        remoteCbPayload: Void;
        repositoryCbPayload: Void;
        version: number;
    }

    class Config {
        public static findProgramdata(): Promise<Buf>;
        public static openDefault(): Promise<Config>;
        public getStringBuf(name: string): Promise<Buf>;
        public lock(tx: Transaction): number;
        public setInt64(name: string, value: number): number;
        public setMultivar(name: string, regexp: string, value: string): number;
        public setString(name: string, value: string): Promise<number>;
        public snapshot(): Promise<Config>;
        public static LEVEL: typeof Config_LEVEL;
    }

    interface ConfigEntry {
        free: any;
        level: number;
        name: string;
        payload: Void;
        value: string;
    }

    class Commit {
        public static create(repo: Repository, update_ref: string, author: Signature, committer: Signature, message_encoding: string, message: string, tree: Tree, parent_count: number, parents: any[]): Promise<Oid>;
        public static createV(id: Oid, repo: Repository, update_ref: string, author: Signature, committer: Signature, message_encoding: string, message: string, tree: Tree, parent_count: number): number;
        public static createWithSignature(repo: Repository, commit_content: string, signature: string, signature_field: string): Promise<Oid>;
        public static lookup(repo: Repository, id: string | Oid, Commit): Promise<Commit>;
        public static lookupPrefix(repo: Repository, id: Oid, len: number): Promise<Commit>;
        public amend(update_ref: string, author: Signature, committer: Signature, message_encoding: string, message: string, tree: Tree): Oid;
        public author(): Signature;
        public body(): string | null;
        public committer(): Signature;
        public date(): Date;
        public dup(): Promise<Commit>;
        public free(): void;
        public getDiff(callback: Function): Promise<Array<Diff>>;
        public getDiffWithOptions(options: Object, callback: Function): Promise<Array<Diff>>;
        public getEntry(path: string): Promise<TreeEntry>;
        public getParents(limit: number, callback: Function): Promise<Array<Commit>>;
        public getTree(): Promise<Tree>;
        public headerField(field: string): Promise<Buf>;
        public history(): EventEmitter;
        public id(): Oid;
        public message(): string;
        public messageEncoding(): string;
        public messageRaw(): string;
        public nthGenAncestor(n: number): Promise<Commit>;
        public owner(): Repository;
        public parent(n: number): Promise<Commit>;
        public parentId(n: number): Oid;
        public parentcount(): number;
        public parents(callback: Function): Array<Oid>;
        public rawHeader(): string;
        public sha(): string;
        public summary(): string | null;
        public time(): number;
        public timeMs(): number;
        public timeOffset(): number;
        public toString(): string;
        public tree(tree_out: Tree): number;
        public treeId(): Oid;
    }

    class ConvenientPatch {
        public hunks(): Promise<Array<ConvenientHunk>>;
        public isAdded(): boolean;
        public isConflicted(): boolean;
        public isCopied(): boolean;
        public isDeleted(): boolean;
        public isIgnored(): boolean;
        public isModified(): boolean;
        public isRenamed(): boolean;
        public isTypeChange(): boolean;
        public isUnmodified(): boolean;
        public isUnreadable(): boolean;
        public isUntracked(): boolean;
        public lineStats(): lineStats;
        public newFile(): DiffFile;
        public oldFile(): DiffFile;
        public size(): number;
        public status(): number;
    }

    class Cred {
        public static defaultNew(): Cred;
        public static sshKeyFromAgent(username: string): Cred;
        public static sshKeyMemoryNew(username: string, publickey: string, privatekey: string, passphrase: string): Promise<Cred>;
        public static sshKeyNew(username: string, publickey: string, privatekey: string, passphrase: string): Cred;
        public static usernameNew(username: string): Promise<Cred>;
        public static userpassPlaintextNew(username: string, password: string): Cred;
        public free(): void;
        public hasUsername(): number;
        public static TYPE: typeof Cred_TYPE;
    }

    interface CredUsername {
        parent: Cred;
        username: string;
    }

    interface CredUserpassPayload {
        password: string;
        username: string;
    }

    interface CvarMap {
        cvarType: number;
        mapValue: number;
        strMatch: string;
    }

    interface DescribeFormatOptions {
        abbreviatedSize: number;
        alwaysUseLongFormat: number;
        dirtySuffix: string;
        version: number;
    }

    interface DescribeOptions {
        describeStrategy: number;
        maxCandidatesTags: number;
        onlyFollowFirstParent: number;
        pattern: string;
        showCommitOidAsFallback: number;
        version: number;
    }

    class Diff {
        public static blobToBuffer(old_blob: Blob, old_as_path: string, buffer: string, buffer_as_path: string, opts: DiffOptions, file_cb: Function, binary_cb: Function, hunk_cb: Function, line_cb: Function): void;
        public static indexToIndex(repo: Repository, old_index: Index, new_index: Index, opts: DiffOptions): Promise<Diff>;
        public static indexToWorkdir(repo: Repository, index: Index, opts: DiffOptions): Promise<Diff>;
        public static treeToIndex(repo: Repository, old_tree: Tree, index: Index, opts: DiffOptions): Promise<Diff>;
        public static treeToTree(repo: Repository, old_tree: Tree, new_tree: Tree, opts: DiffOptions): Promise<Diff>;
        public static treeToWorkdir(repo: Repository, old_tree: Tree, opts: DiffOptions): Promise<Diff>;
        public static treeToWorkdirWithIndex(repo: Repository, old_tree: Tree, opts: DiffOptions): Promise<Diff>;
        public findSimilar(options: DiffFindOptions): Promise<SuccessOrFailure>;
        public getDelta(idx: number): DiffDelta;
        public getPerfdata(): Promise<DiffPerfdata>;
        public merge(from: Diff): Promise<number>;
        public numDeltas(): number;
        public patches(): Promise<Array<ConvenientPatch>>;
        public static DELTA: typeof Diff_DELTA;
        public static FIND: typeof Diff_FIND;
        public static FLAG: typeof Diff_FLAG;
        public static FORMAT: typeof Diff_FORMAT;
        public static FORMAT_EMAIL_FLAGS: typeof Diff_FORMAT_EMAIL_FLAGS;
        public static LINE: typeof Diff_LINE;
        public static OPTION: typeof Diff_OPTION;
        public static STATS_FORMAT: typeof Diff_STATS_FORMAT;
    }

    interface DiffBinary {
        DIFF_BINARY: DiffBinary_DIFF_BINARY;
        newFile: DiffBinaryFile;
        oldFile: DiffBinaryFile;
    }

    interface DiffBinaryFile {
        data: string;
        datalen: number;
        inflatedlen: number;
        type: number;
    }

    interface DiffDelta {
        flags: number;
        newFile: DiffFile;
        nfiles: number;
        oldFile: DiffFile;
        similarity: number;
        status: number;
    }

    class DiffFile {
        public flags(): number;
        public id(): Oid;
        public mode(): number;
        public path(): string;
        public size(): number;
    }

    interface DiffFindOptions {
        breakRewriteThreshold: number;
        copyThreshold: number;
        flags: number;
        renameFromRewriteThreshold: number;
        renameLimit: number;
        renameThreshold: number;
        version: number;
    }

    interface DiffHunk {
        header: string;
        headerLen: number;
        newLines: number;
        newStart: number;
        oldLines: number;
        oldStart: number;
    }

    class DiffLine {
        public content(): string;
    }

    interface DiffOptions {
        contextLines: number;
        flags: number;
        idAbbrev: number;
        ignoreSubmodules: number;
        interhunkLines: number;
        maxSize: number;
        newPrefix: string;
        notifyCb: DiffNotifyCb;
        oldPrefix: string;
        pathspec: Strarray;
        payload: Void;
        progressCb: DiffProgressCb;
        version: number;
    }

    interface DiffPerfdata {
        oidCalculations: number;
        statCalls: number;
        version: number;
    }

    interface Enums {
        CVAR: Enums_CVAR;
        DIRECTION: Enums_DIRECTION;
        FEATURE: Enums_FEATURE;
        IDXENTRY_EXTENDED_FLAG: Enums_IDXENTRY_EXTENDED_FLAG;
        INDXENTRY_FLAG: Enums_INDXENTRY_FLAG;
    }

    interface Error {
        CODE: Error_CODE;
        ERROR: Error_ERROR;
        klass: number;
        message: string;
    }

    class Fetch {
        public static initOptions(opts: FetchOptions, version: number): SuccessOrFailure;
        public static PRUNE: typeof Fetch_PRUNE;
    }

    interface FetchOptions {
        callbacks: RemoteCallbacks;
        customHeaders: Strarray;
        downloadTags: number;
        proxyOpts: ProxyOptions;
        prune: number;
        updateFetchhead: number;
        version: number;
    }

    class Filter {
        public static listContains(filters: FilterList, name: string): number;
        public static listNew(repo: Repository, mode: number, options: number): FilterList;
        public static listStreamBlob(filters: FilterList, blob: Blob, target: Writestream): number;
        public static listStreamData(filters: FilterList, data: Buf, target: Writestream): number;
        public static listStreamFile(filters: FilterList, repo: Repository, path: string, target: Writestream): number;
        public static unregister(name: string): number;
        public lookup(name: string): Filter;
        public register(name: string, priority: number): number;
        public static FLAG: typeof Filter_FLAG;
        public static MODE: typeof Filter_MODE;
    }

    class Giterr {
        public static errClear(): void;
        public static errLast(): Error;
        public static errSetOom(): void;
        public static errSetString(error_class: number, string: string): void;
    }

    class Graph {
        public static aheadBehind(repo: Repository, local: Oid, upstream: Oid): Promise<number>;
        public static descendantOf(repo: Repository, commit: Oid, ancestor: Oid): Promise<number>;
    }

    class Hashsig {
        public static createFromFile(path: string, opts: number): Hashsig;
        public compare(b: Hashsig): number;
        public free(): void;
        public static OPTION: typeof Hashsig_OPTION;
    }

    class Ignore {
        public static addRule(repo: Repository, rules: string): number;
        public static clearInternalRules(repo: Repository): number;
        public static pathIsIgnored(repo: Repository, path: string): Promise<number>;
    }

    interface IndexEntry {
        ctime: IndexTime;
        dev: number;
        fileSize: number;
        flags: number;
        flagsExtended: number;
        gid: number;
        id: Oid;
        ino: number;
        mode: number;
        mtime: IndexTime;
        path: string;
        uid: number;
    }

    interface IndexTime {
        nanoseconds: number;
        seconds: number;
    }

    class Indexer {
        public commit(stats: TransferProgress): number;
        public free(): void;
        public hash(): Oid;
    }

    class Libgit2 {
        public static features(): number;
        public static init(): number;
        public static opts(option: number): number;
        public static shutdown(): number;
        public static version(major: number, minor: number, rev: number): void;
        public static OPT: typeof Libgit2_OPT;
    }

    class Merge {
        public static base(repo: Repository, one: Oid, two: Oid): Promise<Oid>;
        public static bases(repo: Repository, one: Oid, two: Oid): Promise<Oidarray>;
        public static commits(repo: Repository, ourCommit: Commit, theirCommit: Commit, options: MergeOptions): void;
        public static fileInitInput(opts: MergeFileInput, version: number): SuccessOrFailure;
        public static initOptions(opts: MergeOptions, version: number): SuccessOrFailure;
        public static merge(repo: Repository, theirHead: AnnotatedCommit, mergeOpts: MergeOptions, checkoutOpts: CheckoutOptions): void;
        public static trees(repo: Repository, ancestor_tree: Tree, our_tree: Tree, their_tree: Tree, opts: MergeOptions): Promise<Index>;
        public static ANALYSIS: typeof Merge_ANALYSIS;
        public static FILE_FAVOR: typeof Merge_FILE_FAVOR;
        public static FILE_FLAG: typeof Merge_FILE_FLAG;
        public static FLAG: typeof Merge_FLAG;
        public static PREFERENCE: typeof Merge_PREFERENCE;
    }

    class Index {
        public static entryIsConflict(entry: IndexEntry): number;
        public static entryStage(entry: IndexEntry): number;
        public static open(index_path: string): Promise<Index>;
        public add(source_entry: IndexEntry): Promise<number>;
        public addAll(pathspec: Strarray, flags: number, callback: IndexMatchedPathCb, payload: Void): Promise<number>;
        public addByPath(path: string): Promise<number>;
        public caps(): number;
        public checksum(): Oid;
        public clear(): Promise<number>;
        public conflictAdd(ancestor_entry: IndexEntry, our_entry: IndexEntry, their_entry: IndexEntry): Promise<number>;
        public conflictCleanup(): Promise<number>;
        public conflictGet(path: string): Promise<IndexEntry>;
        public conflictRemove(path: string): Promise<number>;
        public entries(): Array<IndexEntry>;
        public entryCount(): number;
        public findPrefix(at_pos: number, prefix: string): number;
        public getByIndex(n: number): IndexEntry;
        public getByPath(path: string, stage: number): IndexEntry;
        public hasConflicts(): number;
        public owner(): Repository;
        public path(): string | null;
        public read(force: number): Promise<number>;
        public readTree(tree: Tree): Promise<number>;
        public remove(path: string, stage: number): Promise<number>;
        public removeAll(pathspec: Strarray, callback: IndexMatchedPathCb, payload: Void): Promise<number>;
        public removeByPath(path: string): Promise<number>;
        public removeDirectory(dir: string, stage: number): Promise<number>;
        public setCaps(caps: number): SuccessOrFailure;
        public updateAll(pathspec: Strarray, callback: IndexMatchedPathCb, payload: Void): Promise<number>;
        public write(): Promise<number>;
        public writeTree(): Promise<Oid>;
        public writeTreeTo(repo: Repository): Promise<Oid>;
        public static ADD_OPTION: typeof Index_ADD_OPTION;
        public static CAP: typeof Index_CAP;
    }

    interface MergeFileInput {
        mode: number;
        path: string;
        ptr: string;
        size: number;
        version: number;
    }

    interface MergeFileOptions {
        ancestorLabel: string;
        favor: number;
        flags: number;
        ourLabel: string;
        theirLabel: string;
        version: number;
    }

    interface MergeFileResult {
        automergeable: number;
        len: number;
        mode: number;
        path: string;
        ptr: string;
    }

    interface MergeOptions {
        defaultDriver: string;
        fileFavor: number;
        fileFlags: number;
        flags: number;
        recursionLimit: number;
        renameThreshold: number;
        targetLimit: number;
        version: number;
    }

    class Note {
        public static create(repo: Repository, notes_ref: string, author: Signature, committer: Signature, oid: Oid, note: string, force: number): Promise<Oid>;
        public static foreach(repo: Repository, notes_ref: string, note_cb: NoteForeachCb, payload: Void): Promise<number>;
        public static iteratorNew(repo: Repository, notes_ref: string): Promise<NoteIterator>;
        public static next(note_id: Oid, annotated_id: Oid, it: NoteIterator): number;
        public static read(repo: Repository, notes_ref: string, oid: Oid): Promise<Note>;
        public static remove(repo: Repository, notes_ref: string, author: Signature, committer: Signature, oid: Oid): Promise<number>;
        public author(): Signature;
        public committer(): Signature;
        public free(): void;
        public id(): Oid;
        public message(): string;
    }

    class Object {
        public static lookup(repo: Repository, id: Oid, type: Object_TYPE): Object;
        public static lookupPrefix(repo: Repository, id: Oid, len: number, type: Object_TYPE): Object;
        public static size(type: Object_TYPE): number;
        public static string2type(str: string): number;
        public static type2string(type: Object_TYPE): string;
        public static typeisloose(type: Object_TYPE): number;
        public dup(): Object;
        public free(): void;
        public id(): Oid;
        public lookupByPath(path: string, type: Object_TYPE): Object;
        public owner(): Repository;
        public peel(target_type: Object_TYPE): Object;
        public shortId(): Buf;
        public type(): Object_TYPE;
        public static TYPE: typeof Object_TYPE;
    }

    class Odb {
        public static open(objects_dir: string): Promise<Odb>;
        public addDiskAlternate(path: string): number;
        public expandIds(ids: OdbExpandId, count: number): number;
        public free(): void;
        public read(id: Oid): Promise<OdbObject>;
        public write(data: Buffer, len: number, type: number): Promise<Oid>;
        public static STREAM: typeof Odb_STREAM;
    }

    interface OdbExpandId {
        id: Oid;
        length: number;
        type: number;
    }

    class OdbObject {
        public data(): Buffer;
        public dup(): OdbObject;
        public free(): void;
        public id(): Oid;
        public size(): number;
        public type(): number;
    }

    class Oid {
        public static fromString(str: string): Oid;
        public cmp(b: Oid): number;
        public cpy(): Oid;
        public equal(b: Oid): number;
        public iszero(): number;
        public ncmp(b: Oid, len: number): number;
        public strcmp(str: string): number;
        public streq(str: string): number;
        public tostrS(): string;
    }

    class Oidarray {
        public free(): void;
    }

    class Openssl {
        public static setLocking(): number;
    }

    class Packbuilder {
        public static create(repo: Repository): Packbuilder;
        public free(): void;
        public hash(): Oid;
        public insert(id: Oid, name: string): number;
        public insertCommit(id: Oid): number;
        public insertRecur(id: Oid, name: string): number;
        public insertTree(id: Oid): number;
        public insertWalk(walk: Revwalk): number;
        public objectCount(): number;
        public setThreads(n: number): number;
        public written(): number;
        public static STAGE: typeof Packbuilder_STAGE;
    }

    class Patch {
        public static convenientFromDiff(diff: Diff): Promise<Patch>;
        public static fromBlobAndBuffer(old_blob: Blob, old_as_path: string, buffer: string, buffer_len: number, buffer_as_path: string, opts: DiffOptions): Promise<Patch>;
        public static fromBlobs(old_blob: Blob, old_as_path: string, new_blob: Blob, new_as_path: string, opts: DiffOptions): Promise<Patch>;
        public static fromDiff(diff: Diff, idx: number): Promise<Patch>;
        public getDelta(): DiffDelta;
        public getHunk(hunk_idx: number): Promise<number>;
        public getLineInHunk(hunk_idx: number, line_of_hunk: number): Promise<DiffLine>;
        public lineStats(): number;
        public numHunks(): number;
        public numLinesInHunk(hunk_idx: number): number;
        public size(include_context: number, include_hunk_headers: number, include_file_headers: number): number;
    }

    class Pathspec {
        public static create(pathspec: Strarray): Pathspec;
        public static matchListDiffEntry(m: PathspecMatchList, pos: number): DiffDelta;
        public static matchListEntry(m: PathspecMatchList, pos: number): string;
        public static matchListEntrycount(m: PathspecMatchList): number;
        public static matchListFailedEntry(m: PathspecMatchList, pos: number): string;
        public static matchListFailedEntrycount(m: PathspecMatchList): number;
        public free(): void;
        public matchDiff(diff: Diff, flags: number): Promise<PathspecMatchList>;
        public matchIndex(index: Index, flags: number): Promise<PathspecMatchList>;
        public matchTree(tree: Tree, flags: number): Promise<PathspecMatchList>;
        public matchWorkdir(repo: Repository, flags: number): Promise<PathspecMatchList>;
        public matchesPath(flags: number, path: string): number;
        public static FLAG: typeof Pathspec_FLAG;
    }

    class Proxy {
        public static initOptions(opts: ProxyOptions, version: number): number;
        public static PROXY: typeof Proxy_PROXY;
    }

    interface ProxyOptions {
        certificateCheck: TransportCertificateCheckCb;
        credentials: CredAcquireCb;
        payload: Void;
        type: number;
        url: string;
        version: number;
    }

    class Push {
        public static initOptions(opts: PushOptions, version: number): SuccessOrFailure;
    }

    interface PushOptions {
        callbacks: RemoteCallbacks;
        customHeaders: Strarray;
        pbParallelism: number;
        proxyOpts: ProxyOptions;
        version: number;
    }

    interface PushUpdate {
        dst: Oid;
        dstRefname: string;
        src: Oid;
        srcRefname: string;
    }

    class Rebase {
        public static init(repo: Repository, branch: AnnotatedCommit, upstream: AnnotatedCommit, onto: AnnotatedCommit, opts: RebaseOptions): Promise<Rebase>;
        public static initOptions(opts: RebaseOptions, version: number): SuccessOrFailure;
        public static open(repo: Repository, opts: RebaseOptions): Promise<Rebase>;
        public abort(): number;
        public commit(author: Signature, committer: Signature, message_encoding: string, message: string): Oid;
        public finish(signature: Signature): number;
        public inmemoryIndex(index: Index): number;
        public next(): Promise<RebaseOperation>;
        public operationByIndex(idx: number): RebaseOperation | null;
        public operationCurrent(): number;
        public operationEntrycount(): number;
    }

    interface RebaseOperation {
        REBASE_OPERATION: RebaseOperation_REBASE_OPERATION;
        exec: string;
        id: Oid;
        type: number;
    }

    interface RebaseOptions {
        checkoutOptions: CheckoutOptions;
        quiet: number;
        rewriteNotesRef: string;
        version: number;
    }

    class Refdb {
        public static open(repo: Repository): Refdb;
        public compress(): number;
        public free(): void;
    }

    class Reflog {
        public static delete(repo: Repository, name: string): number;
        public static read(repo: Repository, name: string): Reflog;
        public static rename(repo: Repository, old_name: string, name: string): number;
        public append(id: Oid, committer: Signature, msg: string): number;
        public drop(idx: number, rewrite_previous_entry: number): number;
        public entryByIndex(idx: number): ReflogEntry;
        public entrycount(): number;
        public free(): void;
        public write(): number;
    }

    class ReflogEntry {
        public committer(): Signature;
        public idNew(): Oid;
        public idOld(): Oid;
        public message(): string;
    }

    class Refspec {
        public direction(): number;
        public dst(): string;
        public dstMatches(refname: string): number;
        public force(): number;
        public src(): string;
        public srcMatches(refname: string): number;
    }

    interface RemoteCallbacks {
        certificateCheck: TransportCertificateCheckCb;
        credentials: CredAcquireCb;
        payload: Void;
        transferProgress: TransferProgressCb;
        transport: TransportCb;
        version: number;
    }

    interface RepositoryInitOptions {
        description: string;
        flags: number;
        initialHead: string;
        mode: number;
        originUrl: string;
        templatePath: string;
        version: number;
        workdirPath: string;
    }

    class Reset {
        public static default(repo: Repository, target: Object, pathspecs: Strarray): Promise<number>;
        public static fromAnnotated(repo: Repository, commit: AnnotatedCommit, reset_type: Reset_TYPE, checkout_opts: CheckoutOptions): number;
        public static reset(repo: Repository, target: Object, reset_type: Reset_TYPE, checkout_opts: CheckoutOptions): Promise<number>;
        public static TYPE: typeof Reset_TYPE;
    }

    class Revert {
        public static commit(repo: Repository, revert_commit: Commit, our_commit: Commit, mainline: number, merge_options: MergeOptions): Promise<Index>;
        public static revert(repo: Repository, commit: Commit, given_opts: RevertOptions): Promise<SuccessOrFailure>;
    }

    class Reference {
        public static create(repo: Repository, name: string, id: Oid, force: number, log_message: string): Reference;
        public static createMatching(repo: Repository, name: string, id: Oid, force: number, current_id: Oid, log_message: string): Reference;
        public static dwim(repo: Repository, id: string | Reference, callback: Function): Promise<Reference>;
        public static ensureLog(repo: Repository, refname: string): number;
        public static hasLog(repo: Repository, refname: string): number;
        public static isValidName(refname: string): number;
        public static list(repo: Repository): any[];
        public static lookup(repo: Repository, id: string | Reference, callback: Function): Promise<Reference>;
        public static nameToId(repo: Repository, name: string): Oid;
        public static normalizeName(buffer_out: string, buffer_size: number, name: string, flags: number): number;
        public static remove(repo: Repository, name: string): number;
        public static symbolicCreate(repo: Repository, name: string, target: string, force: number, log_message: string): Reference;
        public static symbolicCreateMatching(repo: Repository, name: string, target: string, force: number, current_value: string, log_message: string): Reference;
        public cmp(ref2: Reference): number;
        public delete(): number;
        public isBranch(): number;
        public isConcrete(): boolean;
        public isHead(): bool;
        public isNote(): number;
        public isRemote(): number;
        public isSymbolic(): boolean;
        public isTag(): number;
        public isValid(): boolean;
        public name(): string;
        public owner(): Repository;
        public peel(type: number): Object;
        public rename(new_name: string, force: number, log_message: string): Reference;
        public resolve(): Reference;
        public setTarget(id: Oid, log_message: string): Reference;
        public shorthand(): string;
        public symbolicSetTarget(target: string, log_message: string): Reference;
        public symbolicTarget(): string;
        public target(): Oid;
        public targetPeel(): Oid;
        public toString(): string;
        public type(): number;
        public static NORMALIZE: typeof Reference_NORMALIZE;
        public static TYPE: typeof Reference_TYPE;
    }

    interface RevertOptions {
        checkoutOpts: CheckoutOptions;
        mainline: number;
        mergeOpts: MergeOptions;
        version: number;
    }

    class Revparse {
        public static ext(object_out: Object, reference_out: Reference, repo: Repository, spec: string): number;
        public static single(repo: Repository, spec: string): Promise<Object>;
        public static MODE: typeof Revparse_MODE;
    }

    class Revwalk {
        public static create(repo: Repository): Revwalk;
        public fastWalk(max_count: number): Promise<Revwalk>;
        public fileHistoryWalk(filePath: string, max_count: number): Promise<Array<historyEntry>>;
        public getCommits(count: number): Promise<Array<Commit>>;
        public getCommitsUntil(checkFn: Function): Promise<any[]>;
        public hide(commit_id: Oid): number;
        public hideGlob(glob: string): number;
        public hideHead(): number;
        public hideRef(refname: string): number;
        public next(): Promise<Oid>;
        public push(id: Oid): number;
        public pushGlob(glob: string): number;
        public pushHead(): number;
        public pushRange(range: string): number;
        public pushRef(refname: string): number;
        public repository(): Repository;
        public reset(): void;
        public simplifyFirstParent(): void;
        public sorting(sort: number): void;
        public walk(oid: Oid, callback: Function): Commit;
        public static SORT: typeof Revwalk_SORT;
    }

    class Signature {
        public static create(name: string, email: string, time: number, offset: number): Signature | null;
        public static default(repo: Repository): Signature;
        public static now(name: string, email: string): Signature | null;
        public dup(): Promise<Signature>;
        public free(): void;
        public toString(): string;
    }

    class Remote {
        public static addFetch(repo: Repository, remote: string, refspec: string): number;
        public static addPush(repo: Repository, remote: string, refspec: string): number;
        public static create(repo: Repository, name: string, url: string): Promise<Remote>;
        public static createAnonymous(repo: Repository, url: string): Promise<Remote>;
        public static createWithFetchspec(repo: Repository, name: string, url: string, fetch: string): Promise<Remote>;
        public static delete(repo: Repository, name: string): Promise<number>;
        public static initCallbacks(opts: RemoteCallbacks, version: number): SuccessOrFailure;
        public static isValidName(remote_name: string): number;
        public static list(repo: Repository): Promise<any[]>;
        public static lookup(repo: Repository, name: string | Remote, callback: Function): Promise<Remote>;
        public static setAutotag(repo: Repository, remote: string, value: number): number;
        public static setPushurl(repo: Repository, remote: string, url: string): number;
        public static setUrl(repo: Repository, remote: string, url: string): number;
        public autotag(): number;
        public connect(direction: Enums.DIRECTION, callbacks: RemoteCallbacks, proxyOpts: ProxyOptions, customHeaders: Array<string>, callback: Function): Promise<number>;
        public connected(): number;
        public defaultBranch(): Promise<Buf>;
        public disconnect(): void;
        public download(refSpecs: any[], opts: FetchOptions, callback: Function): Promise<number>;
        public dup(): Promise<Remote>;
        public fetch(refSpecs: any[], opts: FetchOptions, message: string, callback: Function): Promise<number>;
        public free(): void;
        public getFetchRefspecs(): Promise<any[]>;
        public getPushRefspecs(): Promise<any[]>;
        public getRefspec(n: number): Refspec;
        public name(): string | null;
        public owner(): Repository;
        public prune(callbacks: RemoteCallbacks): number;
        public pruneRefs(): number;
        public push(refSpecs: any[], options: PushOptions, callback: Function): Promise<number>;
        public pushurl(): string | null;
        public refspecCount(): number;
        public stats(): TransferProgress;
        public stop(): void;
        public updateTips(callbacks: RemoteCallbacks, update_fetchhead: number, download_tags: number, reflog_message: string): number;
        public upload(refspecs: Strarray, opts: PushOptions): number;
        public url(): string;
        public static AUTOTAG_OPTION: typeof Remote_AUTOTAG_OPTION;
        public static COMPLETION_TYPE: typeof Remote_COMPLETION_TYPE;
    }

    class Stash {
        public static apply(repo: Repository, index: number, options: StashApplyOptions): Promise<number>;
        public static applyInitOptions(opts: StashApplyOptions, version: number): SuccessOrFailure;
        public static drop(repo: Repository, index: number): Promise<number>;
        public static foreach(repo: Repository, callback: StashCb, payload: Void): Promise<number>;
        public static pop(repo: Repository, index: number, options: StashApplyOptions): Promise<number>;
        public static save(repo: Repository, stasher: Signature, message: string, flags: number): Promise<Oid>;
        public static APPLY_FLAGS: typeof Stash_APPLY_FLAGS;
        public static APPLY_PROGRESS: typeof Stash_APPLY_PROGRESS;
        public static FLAGS: typeof Stash_FLAGS;
    }

    interface StashApplyOptions {
        checkoutOptions: CheckoutOptions;
        flags: number;
        progressCb: StashApplyProgressCb;
        progressPayload: Void;
        version: number;
    }

    class Status {
        public static byIndex(statuslist: StatusList, idx: number): StatusEntry;
        public static file(repo: Repository, path: string): number;
        public static foreach(repo: Repository, callback: StatusCb, payload: Void): Promise<number>;
        public static foreachExt(repo: Repository, opts: StatusOptions, callback: StatusCb, payload: Void): Promise<number>;
        public static shouldIgnore(ignored: number, repo: Repository, path: string): number;
        public static OPT: typeof Status_OPT;
        public static SHOW: typeof Status_SHOW;
        public static STATUS: typeof Status_STATUS;
    }

    interface StatusEntry {
        headToIndex: DiffDelta;
        indexToWorkdir: DiffDelta;
        status: number;
    }

    class StatusList {
        public static create(repo: Repository, opts: StatusOptions): Promise<StatusList>;
        public entrycount(): number;
        public free(): void;
        public getPerfdata(): Promise<DiffPerfdata>;
    }

    interface StatusOptions {
        flags: number;
        pathspec: Strarray;
        show: number;
        version: number;
    }

    class Strarray {
        public copy(src: Strarray): number;
        public free(): void;
    }

    class Repository {
        public static discover(start_path: string, across_fs: number, ceiling_dirs: string): Promise<Buf>;
        public static init(path: string, is_bare: number): Promise<Repository>;
        public static initExt(repo_path: string, opts: RepositoryInitOptions): Promise<Repository>;
        public static open(path: string): Promise<Repository>;
        public static openBare(bare_path: string): Promise<Repository>;
        public static openExt(path: string, flags: number, ceiling_dirs: string): Promise<Repository>;
        public static wrapOdb(odb: Odb): Promise<Repository>;
        public checkoutBranch(branch: string | Reference, opts: Object, CheckoutOptions): void;
        public checkoutRef(reference: Reference, opts: Object, CheckoutOptions): void;
        public cleanup(): void;
        public config(): Promise<Config>;
        public configSnapshot(): Promise<Config>;
        public continueRebase(signature: Signature, beforeNextFn: Function): Promise<Oid>;
        public createBlobFromBuffer(buffer: Buffer): Oid;
        public createBranch(name: string, commit: Commit | string | Oid, force: bool, signature: Signature, logMessage: string): Promise<Reference>;
        public createCommit(updateRef: string, author: Signature, committer: Signature, message: string, Tree: Tree | Oid | string, parents: any[]): Promise<Oid>;
        public createCommitOnHead(filesToAdd: any[], author: Signature, committer: Signature, message: string): Promise<Oid>;
        public createLightweightTag(string: string | Oid, name: string): Promise<Reference>;
        public createRevWalk(string: string | Oid): RevWalk;
        public createTag(string: string | Oid, name: string, message: string): Promise<Tag>;
        public defaultSignature(): Signature;
        public deleteTagByName(Short: string): void;
        public detachHead(): number;
        public discardLines(filePath: string, selectedLines: any[]): Promise<number>;
        public fetch(remote: string | Remote, fetchOptions: Object, FetchOptions): void;
        public fetchAll(fetchOptions: Object, FetchOptions, callback: Function): void;
        public fetchheadForeach(callback: FetchheadForeachCb): void;
        public free(): void;
        public getBlob(string: string | Oid): Promise<Blob>;
        public getBranch(name: string | Reference): Promise<Reference>;
        public getBranchCommit(name: string | Reference): Promise<Commit>;
        public getCommit(string: string | Oid): Promise<Commit>;
        public getCurrentBranch(): Promise<Reference>;
        public getHeadCommit(): Promise<Commit>;
        public getMasterCommit(): Promise<Commit>;
        public getNamespace(): string | null;
        public getReference(name: string | Reference): Promise<Reference>;
        public getReferenceCommit(name: string | Reference): Promise<Commit>;
        public getReferenceNames(type: Reference.TYPE): Promise<Array<string>>;
        public getReferences(type: Reference.TYPE): Promise<Array<Reference>>;
        public getRemote(remote: string | Remote, callback: Function): Promise<Remote>;
        public getRemotes(Optional: Function): Promise<Object>;
        public getStatus(opts: obj): Promise<Array<StatusFile>>;
        public getStatusExt(opts: obj): Promise<Array<StatusFile>>;
        public getSubmoduleNames(): Promise<Array<string>>;
        public getTag(string: string | Oid): Promise<Tag>;
        public getTagByName(Short: string): Promise<Tag>;
        public getTree(string: string | Oid): Promise<Tree>;
        public head(): Promise<Reference>;
        public headDetached(): number;
        public headUnborn(): number;
        public index(): Promise<Index>;
        public isApplyingMailbox(): boolean;
        public isBare(): number;
        public isBisecting(): boolean;
        public isCherrypicking(): boolean;
        public isDefaultState(): boolean;
        public isEmpty(): number;
        public isMerging(): boolean;
        public isRebasing(): boolean;
        public isReverting(): boolean;
        public isShallow(): number;
        public mergeBranches(to: string | Reference, from: string | Reference, signature: Signature, mergePreference: Merge.PREFERENCE, mergeOptions: MergeOptions): Promise<Oid>;
        public mergeheadForeach(callback: MergeheadForeachCb): void;
        public messageRemove(): number;
        public odb(): Promise<Odb>;
        public path(): string;
        public rebaseBranches(branch: string, upstream: string, onto: string, signature: Signature, beforeNextFn: Function): Promise<Oid>;
        public refdb(): Promise<Refdb>;
        public refreshIndex(): Promise<Index>;
        public setHead(refname: string): Promise<number>;
        public setHeadDetached(commitish: Oid): number;
        public setHeadDetachedFromAnnotated(commitish: AnnotatedCommit): number;
        public setIdent(name: string, email: string): number;
        public setIndex(index: Index): void;
        public setNamespace(nmspace: string): number;
        public setWorkdir(workdir: string, update_gitlink: number): number;
        public stageFilemode(filePath: string | string[], stageNew: boolean): Promise<number>;
        public stageLines(filePath: string, selectedLines: any[], isStaged: boolean): Promise<number>;
        public state(): number;
        public stateCleanup(): number;
        public treeBuilder(tree: Tree): void;
        public workdir(): string;
        public static INIT_FLAG: typeof Repository_INIT_FLAG;
        public static INIT_MODE: typeof Repository_INIT_MODE;
        public static OPEN_FLAG: typeof Repository_OPEN_FLAG;
        public static STATE: typeof Repository_STATE;
    }

    interface SubmoduleUpdateOptions {
        checkoutOpts: CheckoutOptions;
        cloneCheckoutStrategy: number;
        fetchOpts: FetchOptions;
        version: number;
    }

    class Tag {
        public static annotationCreate(repo: Repository, tag_name: string, target: Object, tagger: Signature, message: string): Promise<Oid>;
        public static create(repo: Repository, tag_name: string, target: Object, tagger: Signature, message: string, force: number): Promise<Oid>;
        public static createLightweight(repo: Repository, tag_name: string, target: Object, force: number): Promise<Oid>;
        public static delete(repo: Repository, tag_name: string): Promise<number>;
        public static list(repo: Repository): Promise<any[]>;
        public static listMatch(tag_names: Strarray, pattern: string, repo: Repository): number;
        public static lookup(repo: Repository, id: string | Oid, Tag): Promise<Tag>;
        public static lookupPrefix(repo: Repository, id: Oid, len: number): Promise<Tag>;
        public dup(): Promise<Tag>;
        public free(): void;
        public id(): Oid;
        public message(): string | null;
        public name(): string;
        public owner(): Repository;
        public peel(tag_target_out: Object): number;
        public tagger(): Signature | null;
        public target(): Object;
        public targetId(): Oid;
        public targetType(): number;
    }

    interface Time {
        offset: number;
        time: number;
    }

    interface Trace {
        LEVEL: Trace_LEVEL;
    }

    interface TransferProgress {
        indexedDeltas: number;
        indexedObjects: number;
        localObjects: number;
        receivedBytes: number;
        receivedObjects: number;
        totalDeltas: number;
        totalObjects: number;
    }

    class Transport {
        public static sshWithPaths(owner: Remote, payload: Void): Transport;
        public static unregister(prefix: string): number;
        public init(version: number): SuccessOrFailure;
        public smartCertificateCheck(cert: Cert, valid: number, hostname: string): number;
        public static FLAGS: typeof Transport_FLAGS;
    }

    class Tree {
        public static entryCmp(e1: TreeEntry, e2: TreeEntry): number;
        public static entryDup(dest: TreeEntry, source: TreeEntry): number;
        public static lookup(repo: Repository, id: string | Oid, Tree, callback: Function): Promise<Tree>;
        public static lookupPrefix(repo: Repository, id: Oid, len: number): Promise<Tree>;
        public _entryByIndex(idx: number): TreeEntry;
        public builder(): Treebuilder;
        public diff(tree: Tree, callback: Function): Promise<DiffList>;
        public diffWithOptions(tree: Tree, options: Object, callback: Function): Promise<DiffList>;
        public dup(): Promise<Tree>;
        public entries(): Array<TreeEntry>;
        public entryById(id: Oid): TreeEntry;
        public entryByIndex(i: number): TreeEntry;
        public entryByName(name: string): TreeEntry;
        public entryByPath(path: string): Promise<TreeEntry>;
        public entryCount(): number;
        public free(): void;
        public getEntry(filePath: string): TreeEntry;
        public id(): Oid;
        public owner(): Repository;
        public path(): string;
        public walk(blobsOnly?: boolean): EventEmitter;
        public static WALK_MODE: typeof Tree_WALK_MODE;
    }

    class TreeEntry {
        public filemode(): number;
        public filemodeRaw(): number;
        public free(): void;
        public getBlob(): Promise<Blob>;
        public getTree(): Promise<Tree>;
        public id(): Oid;
        public isBlob(): boolean;
        public isDirectory(): boolean;
        public isFile(): boolean;
        public isTree(): boolean;
        public name(): string;
        public path(): string;
        public sha(): string;
        public toObject(object_out: Object, repo: Repository): number;
        public toString(): void;
        public type(): number;
        public static FILEMODE: typeof TreeEntry_FILEMODE;
    }

    class Treebuilder {
        public static create(repo: Repository, source: Tree): Promise<Treebuilder>;
        public clear(): void;
        public entrycount(): number;
        public free(): void;
        public get(filename: string): TreeEntry;
        public insert(filename: string, id: Oid, filemode: number): Promise<TreeEntry>;
        public remove(filename: string): number;
        public write(): Oid;
    }

    class Submodule {
        public static addSetup(repo: Repository, url: string, path: string, use_gitlink: number): Promise<Submodule>;
        public static foreach(repo: Repository, callback: SubmoduleCb, payload: Void): Promise<number>;
        public static lookup(repo: Repository, name: string): Promise<Submodule>;
        public static resolveUrl(repo: Repository, url: string): Promise<Buf>;
        public static setBranch(repo: Repository, name: string, branch: string): number;
        public static setFetchRecurseSubmodules(repo: Repository, name: string, fetch_recurse_submodules: number): number;
        public static setIgnore(repo: Repository, name: string, ignore: number): Promise<number>;
        public static setUpdate(repo: Repository, name: string, update: number): Promise<number>;
        public static setUrl(repo: Repository, name: string, url: string): Promise<number>;
        public static status(repo: Repository, name: string, ignore: number): Promise<number>;
        public static updateInitOptions(opts: SubmoduleUpdateOptions, version: number): SuccessOrFailure;
        public addFinalize(): Promise<number>;
        public addToIndex(write_index: number): Promise<number>;
        public branch(): string;
        public fetchRecurseSubmodules(): number;
        public free(): void;
        public headId(): Oid;
        public ignore(): number;
        public indexId(): Oid;
        public init(overwrite: number): Promise<number>;
        public location(): Promise<number>;
        public name(): string;
        public open(): Promise<Repository>;
        public owner(): Repository;
        public path(): string;
        public reload(force: number): number;
        public repoInit(use_gitlink: number): Promise<Repository>;
        public sync(): Promise<number>;
        public update(init: number, options: SubmoduleUpdateOptions): Promise<number>;
        public updateStrategy(): number;
        public url(): string;
        public wdId(): Oid;
        public static IGNORE: typeof Submodule_IGNORE;
        public static RECURSE: typeof Submodule_RECURSE;
        public static STATUS: typeof Submodule_STATUS;
        public static UPDATE: typeof Submodule_UPDATE;
    }
}

declare module 'nodegit' {
    export = nodegit;
}

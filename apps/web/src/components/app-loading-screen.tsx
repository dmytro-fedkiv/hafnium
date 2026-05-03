import { RocketLaunchIcon } from "@phosphor-icons/react";

type LoadingStage = "booting" | "reading" | "validating" | "applying" | "ready";

const stageItems: Array<{
  key: LoadingStage;
  label: string;
  pendingValue: string;
}> = [
  { key: "booting", label: "Booting", pendingValue: "100%" },
  { key: "reading", label: "Reading data", pendingValue: "82%" },
  { key: "validating", label: "Validating", pendingValue: "..." },
  { key: "applying", label: "Applying state", pendingValue: "..." },
  { key: "ready", label: "Ready", pendingValue: "..." },
];

const loadingLog = [
  "Boot sequence initiated",
  "Connecting to local store",
  "Reading accounts",
  "Reading transactions",
  "Reading budgets",
  "Almost ready...",
];

export function AppLoadingScreen({ stage }: Readonly<{ stage?: string | null }>) {
  const normalizedStage = normalizeStage(stage);
  const activeIndex = stageItems.findIndex((item) => item.key === normalizedStage);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-8 py-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Hafnum v0.1
        </p>

        <section className="border border-border bg-card px-8 py-12">
          <div className="mx-auto flex max-w-[52rem] flex-col items-center gap-8 text-center">
            <div className="relative grid place-items-center gap-4">
              <span className="absolute -top-3 -left-10 size-1 animate-pulse bg-foreground/70" />
              <span className="absolute -top-1 right-0 size-1 animate-pulse bg-emerald-500/80 [animation-delay:220ms]" />
              <span className="absolute top-16 -left-32 size-1 animate-pulse bg-foreground/60 [animation-delay:420ms]" />
              <span className="absolute top-14 left-28 size-1 animate-pulse bg-foreground/60 [animation-delay:120ms]" />
              <span className="absolute top-24 -right-26 size-1 animate-pulse bg-emerald-500/70 [animation-delay:620ms]" />

              <div className="relative flex items-center justify-center">
                <span className="absolute -top-3 left-1/2 h-4 w-px -translate-x-1/2 bg-border" />
                <RocketLaunchIcon
                  className="size-24 animate-bounce text-foreground animation-duration-[1.6s]"
                  weight="thin"
                />
              </div>

              <div className="grid gap-2">
                <h1 className="font-mono text-4xl font-medium uppercase tracking-tight">
                  Initializing Hafnum_
                </h1>
                <div className="grid gap-1">
                  <p className="font-mono text-2xl uppercase tracking-tight">
                    Synchronizing with local vault
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Preparing your financial universe...
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full max-w-[52rem]">
              <div className="relative mb-4 h-px bg-border">
                <div
                  className="absolute top-0 left-0 h-px bg-emerald-500 transition-[width] duration-700"
                  style={{
                    width: `${((Math.max(activeIndex, 0) + 1) / stageItems.length) * 100}%`,
                  }}
                />
              </div>
              <div className="grid grid-cols-5 gap-3 text-left">
                {stageItems.map((item, index) => {
                  const isActive = index <= activeIndex;
                  const isCurrent = index === activeIndex;

                  return (
                    <div className="grid gap-2" key={item.key}>
                      <div className="flex items-center gap-2">
                        <span
                          className="size-4 border border-border transition-colors data-[active=true]:border-emerald-500 data-[active=true]:bg-emerald-500/15"
                          data-active={isActive}
                        />
                        <span className="font-mono text-[11px] uppercase text-muted-foreground">
                          {item.label}
                        </span>
                      </div>
                      <span
                        className="font-mono text-sm text-muted-foreground data-[current=true]:text-emerald-600 data-[done=true]:text-emerald-600"
                        data-current={isCurrent}
                        data-done={index < activeIndex}
                      >
                        {index < activeIndex ? "100%" : item.pendingValue}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="w-full max-w-[52rem] border border-border px-5 py-4 text-left">
              <div className="grid gap-2">
                {loadingLog.map((entry, index) => (
                  <div
                    className="grid grid-cols-[minmax(0,1fr)_6rem] gap-4 font-mono text-sm text-muted-foreground"
                    key={entry}
                  >
                    <span>&gt; {entry}</span>
                    <span className="text-right">11:42:0{Math.min(index + 1, 8)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function normalizeStage(stage?: string | null): LoadingStage {
  const value = String(stage ?? "")
    .trim()
    .toLowerCase();

  if (!value) {
    return "booting";
  }

  if (value.includes("read")) {
    return "reading";
  }

  if (value.includes("valid")) {
    return "validating";
  }

  if (value.includes("apply")) {
    return "applying";
  }

  if (value.includes("ready")) {
    return "ready";
  }

  return "booting";
}

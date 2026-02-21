import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { usePdfPage } from "@/features/pdf-page/hooks/use-pdf-page";
import {
    RiArrowLeftLine,
    RiCheckboxCircleLine,
    RiFolderOpenLine,
    RiPencilRuler2Line,
} from "@remixicon/react";
import { getRouteApi, Link } from "@tanstack/react-router";

const pdfPageRouteApi = getRouteApi("/pdf-page");

function renderErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
        return error.message;
    }

    return "Unknown error";
}

export function PdfPageView() {
    const { sessionId } = pdfPageRouteApi.useSearch();
    const {
        activeSession,
        allPages,
        isLoadingPages,
        isOpeningDialog,
        openError,
        pagesError,
        openFromDialog,
    } = usePdfPage(sessionId);

    return (
        <div className="bg-background relative h-full w-full overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_5%,var(--color-accent)/20,transparent)]" />

            <div className="relative z-10 flex h-full min-h-0 flex-col">
                <header className="bg-background/80 border-border/70 flex h-14 shrink-0 items-center justify-between border-b px-4 backdrop-blur-sm">
                    <section className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" render={<Link to="/" />}>
                            <RiArrowLeftLine data-icon="inline-start" />
                            Home
                        </Button>
                        <Separator orientation="vertical" className="h-6" />
                        <Button
                            size="sm"
                            onClick={() => {
                                void openFromDialog();
                            }}
                            disabled={isOpeningDialog}
                        >
                            <RiFolderOpenLine data-icon="inline-start" />
                            {isOpeningDialog ? "Opening..." : "Open PDF"}
                        </Button>
                    </section>

                    <section className="text-muted-foreground flex items-center gap-2 text-xs">
                        <RiPencilRuler2Line className="size-4" />
                        <span>Editor workspace</span>
                    </section>
                </header>

                {!activeSession && openError ? (
                    <div className="flex flex-1 items-center justify-center p-8">
                        <Card className="w-full max-w-2xl">
                            <CardHeader>
                                <h1 className="text-base font-semibold">
                                    Could not open PDF session
                                </h1>
                                <p className="text-destructive text-sm">
                                    {renderErrorMessage(openError)}
                                </p>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        void openFromDialog();
                                    }}
                                >
                                    <RiFolderOpenLine data-icon="inline-start" />
                                    Choose another PDF
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                ) : !activeSession ? (
                    <div className="flex flex-1 items-center justify-center p-8">
                        <Card className="w-full max-w-2xl">
                            <CardHeader>
                                <h1 className="text-base font-semibold">
                                    No PDF open yet
                                </h1>
                                <p className="text-muted-foreground text-sm">
                                    Open a file to load all pages in a single
                                    vertical view. You can then scroll through the
                                    whole document like a normal editor.
                                </p>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        void openFromDialog();
                                    }}
                                    disabled={isOpeningDialog}
                                >
                                    <RiFolderOpenLine data-icon="inline-start" />
                                    {isOpeningDialog ? "Opening..." : "Open PDF"}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <>
                        <div className="min-h-0 flex-1">
                            <main className="h-full min-h-0 overflow-y-scroll p-5 pr-6 [scrollbar-gutter:stable] [scrollbar-width:thin] [scrollbar-color:var(--color-border)_transparent] [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:hover:bg-muted-foreground">
                                <section className="mx-auto flex w-full max-w-[900px] min-h-full flex-col gap-5">
                                    <div className="bg-card/80 border-border/70 rounded-lg border p-3">
                                        <p className="truncate text-sm font-semibold">
                                            {activeSession.document.fileName}
                                        </p>
                                        <p className="text-muted-foreground truncate text-xs">
                                            PDF v{activeSession.document.pdfVersion} •{" "}
                                            {activeSession.document.pageCount} pages
                                        </p>
                                    </div>

                                    {isLoadingPages ? (
                                        <Card className="p-6">
                                            <p className="text-muted-foreground text-sm">
                                                Loading all pages...
                                            </p>
                                        </Card>
                                    ) : (
                                        <section className="space-y-5">
                                            {allPages.map((page) => (
                                                <Card
                                                    key={page.pageIndex}
                                                    className="bg-background shadow-accent/10 border-border/70 border shadow-xl"
                                                >
                                                    <CardHeader>
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-base font-semibold">
                                                                Page {page.pageIndex + 1}
                                                            </p>
                                                            <span className="text-muted-foreground text-xs">
                                                                {page.textBlocks.length} blocks
                                                            </span>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent>
                                                        {page.textBlocks.length >
                                                        0 ? (
                                                            <div className="space-y-2">
                                                                {page.textBlocks.map(
                                                                    (
                                                                        text,
                                                                        index,
                                                                    ) => (
                                                                        <p
                                                                            key={`${page.pageIndex}-${index}-${text.slice(0, 24)}`}
                                                                            className="text-sm leading-relaxed"
                                                                        >
                                                                            {text}
                                                                        </p>
                                                                    ),
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <p className="text-muted-foreground text-sm">
                                                                No text blocks on
                                                                this page.
                                                            </p>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </section>
                                    )}
                                    <div className="text-muted-foreground flex items-center gap-1 px-1 text-xs">
                                        <RiCheckboxCircleLine className="size-4" />
                                        Session {activeSession.sessionId.slice(0, 8)}
                                    </div>
                                    {allPages.length === 0 && !isLoadingPages ? (
                                        <Card className="p-6">
                                            <p className="text-muted-foreground text-sm">
                                                No pages loaded.
                                            </p>
                                        </Card>
                                    ) : null}
                                    <div className="h-2" />
                                </section>
                            </main>
                        </div>

                        <footer className="text-muted-foreground border-border/70 flex h-9 shrink-0 items-center justify-between border-t px-4 text-xs">
                            <p className="truncate">
                                {activeSession.document.filePath}
                            </p>
                            <p>
                                Pages loaded {allPages.length} /{" "}
                                {activeSession.document.pageCount}
                            </p>
                        </footer>
                    </>
                )}

                {pagesError ? (
                    <section className="bg-destructive/10 text-destructive border-destructive/40 border-t px-4 py-2 text-sm">
                        <p>Page error: {renderErrorMessage(pagesError)}</p>
                    </section>
                ) : null}
            </div>
        </div>
    );
}

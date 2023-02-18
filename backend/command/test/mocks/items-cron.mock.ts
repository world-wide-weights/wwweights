export class ItemCronJobHandlerMock {
  public correctAllItemTagCountsHasBeenCalled = false;
  public deleteUnusedTagsHasBeenCalled = false;
  correctAllItemTagCounts() {
    this.correctAllItemTagCountsHasBeenCalled = true;
  }

  deleteUnusedTags() {
    this.deleteUnusedTagsHasBeenCalled = true;
  }

  reset() {
    this.deleteUnusedTagsHasBeenCalled = false;
    this.correctAllItemTagCountsHasBeenCalled = false;
  }
}

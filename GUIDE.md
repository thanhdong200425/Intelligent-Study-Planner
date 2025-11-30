# Hướng Dẫn Git/GitHub

## Cách Fetch Một Branch Từ GitHub

### 1. Fetch Tất Cả Branches Từ Remote

Để lấy thông tin về tất cả các branches trên GitHub về local repository:

```bash
git fetch origin
```

Hoặc nếu muốn fetch từ tất cả remotes:

```bash
git fetch --all
```

### 2. Xem Danh Sách Branches

Sau khi fetch, bạn có thể xem các branches có sẵn:

```bash
# Xem tất cả branches (local và remote)
git branch -a

# Chỉ xem remote branches
git branch -r
```

### 3. Pull Latest Changes Từ Branch

Sau khi đã checkout branch, để cập nhật code mới nhất:

```bash
git pull origin <tên-branch>
```

Hoặc nếu bạn đang ở trên branch đó:

```bash
git pull
```
